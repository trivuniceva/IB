package certificatemanagement.certificatemanagement.module;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "certificates")
public class CertificateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Distinguish Name (CN, O, OU, C, E...)
    private String commonName;
    private String organization;
    private String organizationalUnit;
    private String country;
    private String email;

    @Enumerated(EnumType.STRING)
    private CertificateType type; // ROOT, INTERMEDIATE, END_ENTITY

    private LocalDate startDate;
    private LocalDate endDate;

    @Lob
    private byte[] certificateData;  // X.509 sertifikat u DER ili PEM formatu

    @Lob
    private byte[] privateKeyData;   // privatni kljuc (enkriptovan!)

    private boolean revoked = false;
}

