package usersModule.usersModule.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import usersModule.usersModule.dto.CAUserDto;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @PostMapping("/add-ca-user")
    public ResponseEntity<String> addCAUser(@RequestBody CAUserDto userDto) {
        // TODO:
        return ResponseEntity.ok("dodati CA korisnika.");
    }
}
