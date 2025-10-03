package usersModule.usersModule.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import usersModule.usersModule.dto.RegisterRequest;
import usersModule.usersModule.model.User;
import usersModule.usersModule.model.UserRole;
import usersModule.usersModule.model.VerificationToken;
import usersModule.usersModule.repository.UserRepository;
import usersModule.usersModule.repository.VerificationTokenRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public String registerUser(RegisterRequest request) {

        System.out.println(request.toString());

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole(UserRole.REGULAR_USER);

        user.setVerified(false);

        userRepository.save(user);

        VerificationToken token = new VerificationToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(24));
        token.setUsed(false);

        tokenRepository.save(token);

        String verificationLink = "https://localhost:8443/auth/verify?token=" + token.getToken();
        emailService.sendEmail(user.getEmail(), "Verify your account",
                "Click the link to activate your account: " + verificationLink);

        return "Registration successful, please check your email to verify your account.";
    }

    public String verifyToken(String tokenStr) {
        VerificationToken token = tokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (token.isUsed()) {
            throw new RuntimeException("Token already used");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        token.setUsed(true);
        tokenRepository.save(token);

        User user = token.getUser();
        user.setVerified(true);
        userRepository.save(user);

        return "Account successfully verified! You can now log in.";
    }
}
