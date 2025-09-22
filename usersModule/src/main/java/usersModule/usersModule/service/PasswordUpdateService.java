package usersModule.usersModule.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import usersModule.usersModule.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PasswordUpdateService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordUpdateService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void updateAllPasswords() {
        System.out.println("Updating all passwords...");
        userRepository.findAll().forEach(user -> {
            String plainPassword = user.getPassword();
            if (!passwordEncoder.matches(plainPassword, plainPassword)) {
                String encodedPassword = passwordEncoder.encode(plainPassword);
                user.setPassword(encodedPassword);
                userRepository.save(user);
                System.out.println("Password for user " + user.getEmail() + " has been updated.");
            }
        });
        System.out.println("Password update complete!");
    }
}
