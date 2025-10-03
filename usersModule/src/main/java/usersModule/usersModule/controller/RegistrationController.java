package usersModule.usersModule.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

    @GetMapping(value = "/verify", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> verify(@RequestParam("token") String token) {
        System.out.println("veriffff <<<<<<<<<<<<<<<<<<<");
        String message;
        boolean success = false;
        try {
            message = registrationService.verifyToken(token);
            success = true;
        } catch (RuntimeException e) {
            message = e.getMessage();
        }

        String redirectUrl = success
                ? "http://localhost:4200/login?verification_status=success&message=" + message
                : "http://localhost:4200/login?verification_status=error&message=" + message;

        String htmlResponse = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Account Verification</title>
                <meta http-equiv="refresh" content="0; url=%s" />
            </head>
            <body>
                <p>Verifying account... If you are not redirected automatically, <a href="%s">click here</a>.</p>
            </body>
            </html>
            """, redirectUrl, redirectUrl);

        return ResponseEntity.ok(htmlResponse);
    }
}
