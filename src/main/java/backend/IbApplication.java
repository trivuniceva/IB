package backend;

import certificatemanagement.certificatemanagement.CertificateManagementApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import usersModule.usersModule.UsersModuleApplication;

@SpringBootApplication
@Import({UsersModuleApplication.class, CertificateManagementApplication.class})
public class IbApplication {

    public static void main(String[] args) {
        SpringApplication.run(IbApplication.class, args);
    }

}
