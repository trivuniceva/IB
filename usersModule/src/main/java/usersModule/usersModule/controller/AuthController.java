package usersModule.usersModule.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import usersModule.usersModule.dto.JwtResponse;
import usersModule.usersModule.dto.LoginRequest;
import usersModule.usersModule.dto.RefreshRequest;
import usersModule.usersModule.model.User;
import usersModule.usersModule.repository.UserRepository;
import usersModule.usersModule.service.CustomUserDetailsService;
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
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    private PasswordUpdateService passwordUpdateService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserRepository userRepository,
                          CustomUserDetailsService userDetailsService
                          ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("login bejbeee <3");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtService.generateToken(authentication, 5 * 60 * 1000); // 5 min
        String refreshToken = jwtService.generateTokenFromUsername(authentication.getName(), 7 * 24 * 60 * 60 * 1000);

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isPresent()) {
            usersModule.usersModule.model.User user = optionalUser.get();
            // kreira JwtResponse sa svim podacima
            return ResponseEntity.ok(new JwtResponse(
                    accessToken,
                    refreshToken,
                    user.getEmail(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getRole()
            ));
        } else {
            // ako iz nekog razloga korisnik nije pronadjen nakon autentifikacije
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found after successful authentication.");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest request) {
        String username = null;
        try {
            username = jwtService.extractUsername(request.getRefreshToken());
        } catch (Exception e) {
            // Greska pri parsiranju tokena, tipa istekao je
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token.");
        }

        if (username != null) {
            Optional<User> optionalUser = userRepository.findByEmail(username);

            if (optionalUser.isPresent()) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // pozovi validateToken sa oba argumenta
                if (jwtService.validateToken(request.getRefreshToken(), userDetails)) {
                    User user = optionalUser.get();
                    String newAccessToken = jwtService.generateTokenFromUsername(username, 5 * 60 * 1000); // 5 min

                    return ResponseEntity.ok(new JwtResponse(
                            newAccessToken,
                            request.getRefreshToken(),
                            user.getEmail(),
                            user.getFirstname(),
                            user.getLastname(),
                            user.getRole()
                    ));
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found for this refresh token.");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/update-passwords")
    public ResponseEntity<String> updatePasswords() {
        passwordUpdateService.updateAllPasswords();
        return ResponseEntity.ok("Sve lozinke su uspesno hesirane.");
    }

}
