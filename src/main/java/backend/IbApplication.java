package backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"backend", "usersModule", "certificatemanagement"})
public class IbApplication {

    public static void main(String[] args) {
        SpringApplication.run(IbApplication.class, args);
    }

}