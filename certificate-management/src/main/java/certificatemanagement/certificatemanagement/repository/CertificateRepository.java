package certificatemanagement.certificatemanagement.repository;

import certificatemanagement.certificatemanagement.model.CertificateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<CertificateEntity, Long> {
    Optional<CertificateEntity> findBySerialNumber(String serialNumber);
    List<CertificateEntity> findByIssuerIdAndRevoked(Long issuerId, boolean revoked);
}
