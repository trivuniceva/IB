package usersModule.usersModule.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import usersModule.usersModule.dto.JwtResponse;
import usersModule.usersModule.dto.LoginRequest;
import usersModule.usersModule.dto.RefreshRequest;
import usersModule.usersModule.model.User;
import usersModule.usersModule.repository.UserRepository;
import usersModule.usersModule.service.JwtService;
import usersModule.usersModule.service.PasswordUpdateService;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Autowired
    private PasswordUpdateService passwordUpdateService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("login bejbeee <3");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtService.generateToken(authentication, 5 * 60 * 1000); // 5 min
        String refreshToken = jwtService.generateToken(authentication.getName(), 7 * 24 * 60 * 60 * 1000); // 7 dana

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isPresent()) {
            usersModule.usersModule.model.User user = optionalUser.get();
            // Kreirajte JwtResponse sa svim podacima
            return ResponseEntity.ok(new JwtResponse(
                    accessToken,
                    refreshToken,
                    user.getEmail(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getRole()
            ));
        } else {
            // Ako iz nekog razloga korisnik nije pronađen nakon autentifikacije
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found after successful authentication.");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest request) {
        if (jwtService.validateToken(request.getRefreshToken())) {
            String username = jwtService.extractUsername(request.getRefreshToken());

            Optional<User> optionalUser = userRepository.findByEmail(username);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                String newAccessToken = jwtService.generateToken(username, 5 * 60 * 1000); // 5 min

                return ResponseEntity.ok(new JwtResponse(
                        newAccessToken,
                        request.getRefreshToken(),
                        user.getEmail(),
                        user.getFirstname(),
                        user.getLastname(),
                        user.getRole()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user in refresh token.");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/update-passwords")
    public ResponseEntity<String> updatePasswords() {
        passwordUpdateService.updateAllPasswords();
        return ResponseEntity.ok("Sve lozinke su uspešno heširane.");
    }
}
