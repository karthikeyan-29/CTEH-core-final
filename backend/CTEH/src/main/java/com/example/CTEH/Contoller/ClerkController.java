package com.example.CTEH.Contoller;


import com.example.CTEH.Service.ClerkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClerkController {

    private final ClerkService clerkService;

    public ClerkController(ClerkService clerkService) {
        this.clerkService = clerkService;
    }

    @GetMapping("/api/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String search) {
        try {
            Object response = clerkService.searchUsers(search);  // Get the response from service
            return ResponseEntity.ok(response);  // Return it properly wrapped
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching users: " + e.getMessage());
        }
    }
}
