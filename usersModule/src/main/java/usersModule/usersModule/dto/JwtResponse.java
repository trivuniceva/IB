package usersModule.usersModule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import usersModule.usersModule.model.UserRole;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String firstname;
    private String lastname;
    private UserRole role;
}
