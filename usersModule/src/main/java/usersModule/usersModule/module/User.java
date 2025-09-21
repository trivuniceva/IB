package usersModule.usersModule.module;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstname;
    private String lastname;

    @Enumerated(EnumType.STRING)
    private UserRole role;
}
