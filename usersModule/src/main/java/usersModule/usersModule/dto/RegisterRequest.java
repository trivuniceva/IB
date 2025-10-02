package usersModule.usersModule.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String confirmPassword;
    private String firstname;
    private String lastname;
    private String organization;
}
