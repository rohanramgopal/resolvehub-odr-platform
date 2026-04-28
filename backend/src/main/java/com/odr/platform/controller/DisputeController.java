package com.odr.platform.controller;

import com.odr.platform.entity.Dispute;
import com.odr.platform.repository.DisputeRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disputes")
@CrossOrigin(origins = "http://localhost:5173")
public class DisputeController {

    private final DisputeRepository repo;

    public DisputeController(DisputeRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Dispute create(@RequestBody Dispute d) {
        if (d.status == null || d.status.isBlank()) {
            d.status = "FILED";
        }
        return repo.save(d);
    }

    @GetMapping
    public List<Dispute> getAll() {
        return repo.findAll();
    }

    @PutMapping("/{id}/status")
    public Dispute updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Dispute dispute = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        dispute.status = body.getOrDefault("status", dispute.status);
        dispute.resolutionNote = body.getOrDefault("resolutionNote", dispute.resolutionNote);

        return repo.save(dispute);
    }

    @PostMapping("/{id}/upload")
    public Dispute uploadEvidence(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws Exception {
        Dispute dispute = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        File folder = new File("uploads");
        if (!folder.exists()) {
            folder.mkdirs();
        }

        File savedFile = new File(folder, file.getOriginalFilename());
        file.transferTo(savedFile);

        dispute.evidenceFileName = file.getOriginalFilename();

        return repo.save(dispute);
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        List<Dispute> disputes = repo.findAll();

        long filed = disputes.stream().filter(d -> "FILED".equals(d.status)).count();
        long review = disputes.stream().filter(d -> "UNDER_REVIEW".equals(d.status)).count();
        long mediation = disputes.stream().filter(d -> "IN_MEDIATION".equals(d.status)).count();
        long resolved = disputes.stream().filter(d -> "RESOLVED".equals(d.status)).count();
        long rejected = disputes.stream().filter(d -> "REJECTED".equals(d.status)).count();

        Map<String, Object> map = new HashMap<>();
        map.put("total", disputes.size());
        map.put("filed", filed);
        map.put("review", review);
        map.put("mediation", mediation);
        map.put("resolved", resolved);
        map.put("rejected", rejected);

        return map;
    }
}
