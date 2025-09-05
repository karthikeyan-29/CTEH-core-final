package com.example.CTEH.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;

@Service
public class ClerkService {

    private static final String CLERK_API_KEY = "sk_test_JAuGVTTd887X5D6sh8rVg4mlr8udMglHu4YxW5TAYd"; // Use your secret key
    private static final String CLERK_API_URL = "https://api.clerk.dev/v1/users";

    public List<Map<String, Object>> searchUsers(String searchQuery) {
        RestTemplate restTemplate = new RestTemplate();

        // Create HTTP Headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + CLERK_API_KEY);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Construct URL with search query
        String url = CLERK_API_URL + "?query=" + searchQuery;

        // Send GET request to Clerk API and get a List of users
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );

        return response.getBody(); // Return the List of users
    }
}
