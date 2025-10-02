package usersModule.usersModule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import usersModule.usersModule.model.VerificationToken;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
}
