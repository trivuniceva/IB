package certificatemanagement.certificatemanagement.service;

import certificatemanagement.certificatemanagement.dto.CertRequestDto;
import certificatemanagement.certificatemanagement.dto.CertificateDto;
import certificatemanagement.certificatemanagement.model.CertificateEntity;
import certificatemanagement.certificatemanagement.model.CertificateType;
import certificatemanagement.certificatemanagement.repository.CertificateRepository;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.asn1.x509.CRLReason;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.X509v2CRLBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CRLConverter;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.security.*;
import java.security.cert.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EncryptionService encryptionService;

    @Autowired
    public CertificateService(CertificateRepository certificateRepository, EncryptionService encryptionService) {
        this.certificateRepository = certificateRepository;
        this.encryptionService = encryptionService;
    }

    public CertificateDto createCertificate(CertRequestDto request) {
        try {
            KeyPair keyPair = generateKeyPair();
            X509Certificate certificate;
            PrivateKey privateKeyToSave = keyPair.getPrivate();
            CertificateEntity issuerEntity = null;

            if (request.getType() == CertificateType.ROOT) {
                // ROOT sertifikat - samopotpisan, izdavalac je isto lice kao i subjekat
                X500Name subjectName = new X500Name("CN=" + request.getCommonName() + ", O=" + request.getOrganization() + ", OU=" + request.getOrganizationalUnit() + ", C=" + request.getCountry() + ", E=" + request.getEmail());
                certificate = generateX509Certificate(request, keyPair, subjectName, keyPair.getPrivate());
            } else {
                // ostali sertifikati - Intermediate i End-Entity
                issuerEntity = certificateRepository.findById(request.getIssuerId())
                        .orElseThrow(() -> new RuntimeException("Sertifikat izdavaoca nije pronadjen."));

                // proveri validnost izdavaoca
                if (issuerEntity.isRevoked() || issuerEntity.getEndDate().isBefore(LocalDate.now())) {
                    throw new RuntimeException("Sertifikat izdavaoca je opozvan ili istekao.");
                }

                // dekriptuj privatni kljuc izdavaoca
                byte[] decryptedPrivateKeyBytes = encryptionService.decrypt(issuerEntity.getPrivateKeyData());
                KeyFactory keyFactory = KeyFactory.getInstance("RSA");
                PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(decryptedPrivateKeyBytes);
                PrivateKey issuerPrivateKey = keyFactory.generatePrivate(privateKeySpec);

                // Kreiraj X500Name objekat za izdavaoca
                X500Name issuerName = new X500Name("CN=" + issuerEntity.getCommonName() + ", O=" + issuerEntity.getOrganization() + ", OU=" + issuerEntity.getOrganizationalUnit() + ", C=" + issuerEntity.getCountry() + ", E=" + issuerEntity.getEmail());

                certificate = generateX509Certificate(request, keyPair, issuerName, issuerPrivateKey);
            }

            CertificateEntity entity = new CertificateEntity();
            entity.setCommonName(request.getCommonName());
            entity.setOrganization(request.getOrganization());
            entity.setOrganizationalUnit(request.getOrganizationalUnit());
            entity.setCountry(request.getCountry());
            entity.setEmail(request.getEmail());
            entity.setType(request.getType());
            entity.setStartDate(LocalDate.now());
            entity.setEndDate(LocalDate.now().plusDays(request.getValidityDays()));
            entity.setSerialNumber(certificate.getSerialNumber().toString());

            if (request.getIssuerId() != null) {
                entity.setIssuerId(request.getIssuerId());
            }

            entity.setPrivateKeyData(encryptionService.encrypt(privateKeyToSave.getEncoded()));
            entity.setCertificateData(certificate.getEncoded());

            certificateRepository.save(entity);

            return mapToDto(entity);
        } catch (Exception e) {
            throw new RuntimeException("Greska pri kreiranju sertifikata: " + e.getMessage(), e);
        }
    }

    // validacija izdavaioca
    private void validateIssuerCertificate(CertificateEntity issuerEntity) throws GeneralSecurityException, IOException, CertificateException {
        // ucitaj CA sertifikat iz baze
        CertificateFactory certFactory = CertificateFactory.getInstance("X.509", "BC");
        X509Certificate issuerCert = (X509Certificate) certFactory.generateCertificate(new ByteArrayInputStream(issuerEntity.getCertificateData()));

        // provera vremenske validnosti
        try {
            issuerCert.checkValidity();
        } catch (CertificateExpiredException | CertificateNotYetValidException e) {
            throw new RuntimeException("Sertifikat izdavaoca je istekao ili još uvek nije validan.", e);
        }

        // provera povucenosti
        if (issuerEntity.isRevoked()) {
            throw new RuntimeException("Sertifikat izdavaoca je povučen.");
        }
    }


    private X509Certificate generateX509Certificate(CertRequestDto request, KeyPair keyPair, X500Name issuerName, PrivateKey issuerPrivateKey) throws Exception {
        X500Name subjectName = new X500Name("CN=" + request.getCommonName() + ", O=" + request.getOrganization() + ", OU=" + request.getOrganizationalUnit() + ", C=" + request.getCountry() + ", E=" + request.getEmail());

        BigInteger serial = BigInteger.valueOf(new SecureRandom().nextInt());
        Date notBefore = new Date();
        Date notAfter = Date.from(LocalDate.now().plusDays(request.getValidityDays()).atStartOfDay(ZoneId.systemDefault()).toInstant());

        // JcaX509v3CertificateBuilder prima ispravne podatke o izdavaocu
        JcaX509v3CertificateBuilder certBuilder = new JcaX509v3CertificateBuilder(
                issuerName, serial, notBefore, notAfter, subjectName, keyPair.getPublic());

        if (request.getType() != CertificateType.END_ENTITY) {
            certBuilder.addExtension(Extension.basicConstraints, true, new BasicConstraints(true));
            certBuilder.addExtension(Extension.keyUsage, true, new KeyUsage(KeyUsage.keyCertSign | KeyUsage.cRLSign));
        } else {
            certBuilder.addExtension(Extension.basicConstraints, true, new BasicConstraints(false));
            certBuilder.addExtension(Extension.keyUsage, true, new KeyUsage(KeyUsage.digitalSignature | KeyUsage.keyEncipherment));
        }

        // Dodaj CRL Distribution Point ekstenziju
        // Napomena: Potrebno je definisati URI
        // certBuilder.addExtension(Extension.cRLDistributionPoints, false, new CRLDistributionPoints(new DistributionPoint[] { new DistributionPoint(new DistributionPointName(new GeneralNames(new GeneralName(GeneralName.uniformResourceIdentifier, "http://.../crl/..." + issuerEntity.getId()))), null, null) }));

        ContentSigner signer = new JcaContentSignerBuilder("SHA256WithRSA").build(issuerPrivateKey);
        return new JcaX509CertificateConverter().getCertificate(certBuilder.build(signer));
    }

    public List<CertificateDto> getAllCertificates() {
        return certificateRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public boolean revokeCertificate(Long id) {
        Optional<CertificateEntity> certOpt = certificateRepository.findById(id);
        if (certOpt.isPresent()) {
            CertificateEntity cert = certOpt.get();
            cert.setRevoked(true);
            certificateRepository.save(cert);
            return true;
        }
        return false;
    }

    private KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        return keyGen.generateKeyPair();
    }

    private CertificateDto mapToDto(CertificateEntity entity) {
        return new CertificateDto(
                entity.getId(),
                entity.getCommonName(),
                entity.getOrganization(),
                entity.getOrganizationalUnit(),
                entity.getCountry(),
                entity.getEmail(),
                entity.getType(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.isRevoked()
        );
    }

    // metoda za kreiranje CRL-a za datog izdavaoca
    public byte[] generateCrl(Long caId) throws GeneralSecurityException, IOException, CertificateException, OperatorCreationException {
        CertificateEntity caCertificateEntity = certificateRepository.findById(caId)
                .orElseThrow(() -> new IllegalArgumentException("CA sertifikat sa datim ID-em nije pronađen."));

        // dekriptuj privatni kljuc izdavaoca
        byte[] decryptedPrivateKeyBytes = encryptionService.decrypt(caCertificateEntity.getPrivateKeyData());
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(decryptedPrivateKeyBytes);
        PrivateKey caPrivateKey = keyFactory.generatePrivate(privateKeySpec);

        // ucitaj CA sertifikat iz baze
        CertificateFactory certFactory = CertificateFactory.getInstance("X.509", "BC");
        X509Certificate caCert = (X509Certificate) certFactory.generateCertificate(new ByteArrayInputStream(caCertificateEntity.getCertificateData()));

        X500Name caName = new X500Name(caCert.getSubjectX500Principal().getName());

        Date now = new Date();
        Date nextUpdate = Date.from(LocalDate.now().plusDays(30).atStartOfDay(ZoneId.systemDefault()).toInstant()); // CRL važi 30 dana

        X509v2CRLBuilder crlBuilder = new X509v2CRLBuilder(caName, now);
        crlBuilder.setNextUpdate(nextUpdate);

        // pronadji sve povucene sertifikate koje je ovaj CA izdao
        List<CertificateEntity> revokedCertificates = certificateRepository.findByIssuerIdAndRevoked(caId, true);

        for (CertificateEntity cert : revokedCertificates) {
            // dodaj svaki povuceni sertifikat u CRL
            crlBuilder.addCRLEntry(new BigInteger(cert.getSerialNumber()), new Date(), CRLReason.unspecified);
        }

        ContentSigner contentSigner = new JcaContentSignerBuilder("SHA256WithRSA").build(caPrivateKey);
        X509CRL crl = new JcaX509CRLConverter().getCRL(crlBuilder.build(contentSigner));

        return crl.getEncoded();
    }

    // metoda za proveru validnosti sertifikata
    public boolean isCertificateRevoked(String serialNumber) {
        return certificateRepository.findBySerialNumber(serialNumber)
                .map(CertificateEntity::isRevoked)
                .orElse(false);
    }

    // metoda za preuzimanje sertifikata
    public byte[] downloadCertificate(Long id) {
        Optional<CertificateEntity> certOpt = certificateRepository.findById(id);
        if (certOpt.isEmpty()) {
            throw new RuntimeException("Sertifikat nije pronadjen.");
        }
        return certOpt.get().getCertificateData();
    }

    // preuzimanje privatnog kkljuca
    public byte[] downloadPrivateKey(Long id) {
        Optional<CertificateEntity> certOpt = certificateRepository.findById(id);
        if (certOpt.isEmpty()) {
            throw new RuntimeException("Sertifikat nije pronadjen.");
        }
        try {
            byte[] encryptedPrivateKey = certOpt.get().getPrivateKeyData();
            return encryptionService.decrypt(encryptedPrivateKey);
        } catch (Exception e) {
            throw new RuntimeException("Greska pri desifrovanju privatnog kljuca: " + e.getMessage());
        }
    }

    public boolean isCertificateValid(Long id) {
        Optional<CertificateEntity> certOpt = certificateRepository.findById(id);

        if (certOpt.isEmpty()) {
            return false; // sertifikat ne postoji
        }

        CertificateEntity certificate = certOpt.get();

        // 1.provera datuma vazenja
        LocalDate today = LocalDate.now();
        if (today.isBefore(certificate.getStartDate()) || today.isAfter(certificate.getEndDate())) {
            return false;
        }

        // 2. provera opoziva
        if (certificate.isRevoked()) {
            return false;
        }

        // 3. prover lanca poverenja
        // rekurzivna metoda osigurava da je svaki sertifikat u lancu validan
        return validateCertificateChain(certificate);
    }

    private boolean validateCertificateChain(CertificateEntity certificate) {
        if (certificate.getIssuerId() == null) {
            // ako je issuerId null, ovo je Root sertifikat
            return "ROOT".equals(certificate.getType().name());
        }

        Optional<CertificateEntity> issuerOpt = certificateRepository.findById(certificate.getIssuerId());

        if (issuerOpt.isEmpty()) {
            return false; // izdavalac nije pronadjen, lanac prekinut
        }

        CertificateEntity issuer = issuerOpt.get();

        // rekurzivno proverava izdavaoca
        // provera opoziva unutar rekurzije, ako je izdavalac opozvan, ceo lanac je nevazeci
        if (issuer.isRevoked()) {
            return false;
        }

        // provera da li je izdavalac sertifikat i da li je datum vazenja ispravan
        LocalDate today = LocalDate.now();
        if (today.isBefore(issuer.getStartDate()) || today.isAfter(issuer.getEndDate())) {
            return false;
        }

        return validateCertificateChain(issuer);
    }
}