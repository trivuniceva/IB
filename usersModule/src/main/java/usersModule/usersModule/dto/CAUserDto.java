package usersModule.usersModule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import usersModule.usersModule.model.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CAUserDto {
    private String email;
    private String password;
    private String firstname;
    private String lastname;
    private UserRole role;
}