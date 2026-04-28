package com.odr.platform.controller;

import com.odr.platform.entity.User;
import com.odr.platform.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository repo;

    public AuthController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (user.role == null || user.role.isBlank()) {
            user.role = "USER";
        }
        return repo.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User request) {
        User user = repo.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!user.password.equals(request.password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
