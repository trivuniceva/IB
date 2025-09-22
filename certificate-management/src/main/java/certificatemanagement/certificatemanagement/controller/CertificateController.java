package certificatemanagement.certificatemanagement.controller;

import certificatemanagement.certificatemanagement.dto.CertRequestDto;
import certificatemanagement.certificatemanagement.dto.CertificateDto;
import certificatemanagement.certificatemanagement.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@CrossOrigin(origins = "http://localhost:4200")
public class CertificateController {

    private final CertificateService certificateService;

    @Autowired
    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    /**
     * kreira novi sertifikat
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<CertificateDto> createCertificate(@RequestBody CertRequestDto request) {
        System.out.println("createCertificate ->>>");
        CertificateDto created = certificateService.createCertificate(request);

        System.out.println("Authenticated user: " + SecurityContextHolder.getContext().getAuthentication());
        System.out.println(request.toString());

        return ResponseEntity.ok(created);
    }

    /**
     * vraca listu svih sertifikata.
     */
    @GetMapping
    public ResponseEntity<List<CertificateDto>> getAllCertificates() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    /**
     * opoziva sertifikat po ID-u.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/revoke")
    public ResponseEntity<String> revokeCertificate(@PathVariable Long id) {
        boolean revoked = certificateService.revokeCertificate(id);
        if (revoked) {
            return ResponseEntity.ok("Sertifikat sa ID " + id + " je opozvan.");
        } else {
            return ResponseEntity.badRequest().body("Sertifikat nije pronadjen.");
        }
    }
}
