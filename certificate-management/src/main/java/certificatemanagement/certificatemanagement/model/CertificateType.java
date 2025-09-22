package certificatemanagement.certificatemanagement.model;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CertificateType {
    ROOT,
    INTERMEDIATE,
    END_ENTITY;

    @JsonCreator
    public static CertificateType fromString(String key) {
        return key == null ? null : CertificateType.valueOf(key.toUpperCase().replace("-", "_"));
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
