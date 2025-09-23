package certificatemanagement.certificatemanagement.controller;

import certificatemanagement.certificatemanagement.dto.CertRequestDto;
import certificatemanagement.certificatemanagement.dto.CertificateDto;
import certificatemanagement.certificatemanagement.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@CrossOrigin(origins = "http://localhost:4200")
public class CertificateController {

    private final CertificateService certificateService;

    @Autowired
    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    /**
     * kreira novi sertifikat
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<CertificateDto> createCertificate(@RequestBody CertRequestDto request) {
        System.out.println("createCertificate ->>>");
        CertificateDto created = certificateService.createCertificate(request);

        System.out.println("Authenticated user: " + SecurityContextHolder.getContext().getAuthentication());
        System.out.println(request.toString());

        return ResponseEntity.ok(created);
    }

    /**
     * vraca listu svih sertifikata.
     */
    @GetMapping
    public ResponseEntity<List<CertificateDto>> getAllCertificates() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    /**
     * opoziva sertifikat po ID-u.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/revoke")
    public ResponseEntity<String> revokeCertificate(@PathVariable Long id) {
        boolean revoked = certificateService.revokeCertificate(id);
        if (revoked) {
            return ResponseEntity.ok("Sertifikat sa ID " + id + " je opozvan.");
        } else {
            return ResponseEntity.badRequest().body("Sertifikat nije pronadjen.");
        }
    }

    /**
     * generise i preuzima CRL listu za datog izdavaoca (CA).
     */
    @GetMapping("/{caId}/crl")
    public ResponseEntity<byte[]> getCrl(@PathVariable Long caId) {
        try {
            byte[] crlBytes = certificateService.generateCrl(caId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "crl-list.crl");

            return new ResponseEntity<>(crlBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Greska pri generisanju CRL-a: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * preuzimanje sertifikata
     */
    @GetMapping("/{id}/download-certificate")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long id) {
        byte[] certificateData = certificateService.downloadCertificate(id);
        String filename = "certificate_" + id + ".cer"; // .cer je uobicajena ekstenzija za X.509 sertifikate
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);
        return new ResponseEntity<>(certificateData, headers, HttpStatus.OK);
    }

    /**
     * preuzimanje privatnog kljuca
     */
    @GetMapping("/{id}/download-private-key")
    public ResponseEntity<byte[]> downloadPrivateKey(@PathVariable Long id) {
        byte[] privateKeyData = certificateService.downloadPrivateKey(id);
        String filename = "private_key_" + id + ".pem"; // .pem je ekstenzija za kljuceva
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);
        return new ResponseEntity<>(privateKeyData, headers, HttpStatus.OK);
    }

    @GetMapping("/{id}/validate")
    public ResponseEntity<Boolean> isCertificateValid(@PathVariable Long id) {
        boolean isValid = certificateService.isCertificateValid(id);
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }

}
