package certificatemanagement.certificatemanagement.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    private byte[] certificateData;

    @Lob
    private byte[] privateKeyData;

    private boolean revoked = false;

    private String serialNumber;

    private Long issuerId;
}
