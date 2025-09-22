package certificatemanagement.certificatemanagement.repository;

import certificatemanagement.certificatemanagement.model.CertificateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<CertificateEntity, Long> {
//    CertificateEntity findBySerialNumber(String serialNumber);
}
