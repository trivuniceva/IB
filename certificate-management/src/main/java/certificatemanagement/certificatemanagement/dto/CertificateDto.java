package certificatemanagement.certificatemanagement.dto;

import certificatemanagement.certificatemanagement.model.CertificateType;
import java.time.LocalDate;

public class CertificateDto {

    private Long id;
    private String commonName;
    private String organization;
    private String organizationalUnit;
    private String country;
    private String email;
    private CertificateType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean revoked;

    public CertificateDto(Long id, String commonName, String organization,
                          String organizationalUnit, String country, String email,
                          CertificateType type, LocalDate startDate,
                          LocalDate endDate, boolean revoked) {
        this.id = id;
        this.commonName = commonName;
        this.organization = organization;
        this.organizationalUnit = organizationalUnit;
        this.country = country;
        this.email = email;
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.revoked = revoked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommonName() {
        return commonName;
    }

    public void setCommonName(String commonName) {
        this.commonName = commonName;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getOrganizationalUnit() {
        return organizationalUnit;
    }

    public void setOrganizationalUnit(String organizationalUnit) {
        this.organizationalUnit = organizationalUnit;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public CertificateType getType() {
        return type;
    }

    public void setType(CertificateType type) {
        this.type = type;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public void setRevoked(boolean revoked) {
        this.revoked = revoked;
    }
}
