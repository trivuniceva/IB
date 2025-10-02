package usersModule.usersModule.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import usersModule.usersModule.dto.ApiResponse;
import usersModule.usersModule.dto.RegisterRequest;
import usersModule.usersModule.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class RegistrationController {

    @Autowired
    private AuthService registrationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String message = registrationService.registerUser(request);
        return ResponseEntity.ok(new ApiResponse(message));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam("token") String token) {
        String message = registrationService.verifyToken(token);
        return ResponseEntity.ok(new ApiResponse(message));
    }
}
