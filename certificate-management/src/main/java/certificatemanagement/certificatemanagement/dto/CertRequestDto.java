package certificatemanagement.certificatemanagement.dto;

import certificatemanagement.certificatemanagement.model.CertificateType;

import java.time.LocalDate;

public class CertRequestDto {

    private String commonName;
    private String organization;
    private String organizationalUnit;
    private String country;
    private String email;
    private CertificateType type;   // ROOT, INTERMEDIATE, END_ENTITY
    private LocalDate endDate;      // do kog datuma vazi sertifikat
    private Long issuerId;
    private int validityDays;

    public CertRequestDto() {
    }

    public CertRequestDto(String commonName, String organization, String organizationalUnit,
                          String country, String email, CertificateType type, LocalDate endDate, Long issuerId, int validityDays) {
        this.commonName = commonName;
        this.organization = organization;
        this.organizationalUnit = organizationalUnit;
        this.country = country;
        this.email = email;
        this.type = type;
        this.endDate = endDate;
        this.issuerId = issuerId;
        this.validityDays = validityDays;
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

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getIssuerId() {
        return issuerId;
    }

    public void setIssuerId(Long issuerId) {
        this.issuerId = issuerId;
    }

    public int getValidityDays() {
        return validityDays;
    }

    public void setValidityDays(int validityDays) {
        this.validityDays = validityDays;
    }

    @Override
    public String toString() {
        return "CertRequestDto{" +
                "commonName='" + commonName + '\'' +
                ", organization='" + organization + '\'' +
                ", organizationalUnit='" + organizationalUnit + '\'' +
                ", country='" + country + '\'' +
                ", email='" + email + '\'' +
                ", type=" + type +
                ", endDate=" + endDate +
                ", issuerId=" + issuerId +
                ", validityDays=" + validityDays +
                '}';
    }
}
