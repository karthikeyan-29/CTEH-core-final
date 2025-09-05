package com.example.CTEH.Contoller;


import com.example.CTEH.Model.Event;
import com.example.CTEH.Service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.CTEH.Service.EventService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class EventController {
   @Autowired
   private EventService service;

    @PostMapping(value = "/event", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEvent(
            @RequestPart(name = "event") String eventJson, // Accept as String and deserialize manually
            @RequestPart(name = "imageFile") MultipartFile imageFile
    ) {
        try {
            // Deserialize JSON string to Event object
            ObjectMapper objectMapper = new ObjectMapper();
            Event event = objectMapper.readValue(eventJson, Event.class);

            Event newEvent = service.createEvent(event, imageFile);
            return new ResponseEntity<>(newEvent, HttpStatus.CREATED);
        } catch (Exception e) {
            String errorMessage = e.getMessage() != null ? e.getMessage() : "An error occurred while creating the event";
            System.err.println("Error creating event: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
   @GetMapping("/event/{id}")
   public ResponseEntity<?> getEventById(@PathVariable int id){
       Optional<Event> event=service.getEventById(id);
       return new ResponseEntity<>(event,HttpStatus.OK);
   }

   @GetMapping("/events")
   public ResponseEntity<?> getAllEvents(){
       try{
           return new ResponseEntity<>(service.getAll(),HttpStatus.OK);
       }catch(Exception e){
           return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
       }
   }
    @GetMapping("/event/{eventId}/image")
    public ResponseEntity<byte[]> getImageByEventId(@PathVariable int eventId) { // Fixed parameter name
        Optional<Event> event = service.getEventById(eventId);
        if (event.isPresent() && event.get().getImageData() != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf(event.get().getImageType()))
                    .body(event.get().getImageData());
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/events/search")
    public ResponseEntity<?> searchEvents(@RequestParam("query") String query) {
        try {
            return new ResponseEntity<>(service.searchEvents(query), HttpStatus.OK);
        } catch (Exception e) {
            String errorMessage = e.getMessage() != null ? e.getMessage() : "An error occurred while searching events";
            System.err.println("Error searching events: " + e.getMessage());
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/registered-events/{email}")
    public ResponseEntity<?> getEventsByEmail(@PathVariable String email){
        List<Event> events=service.getAllEvents()
                .stream()
                .filter(event->event.getCollegeMailId().equals(email))
                .toList();
        if(!events.isEmpty()){
            return new ResponseEntity<>(events,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete-event/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable int id){
        boolean isDeleted= service.deleteEvent(id);
        if(isDeleted){
            return new ResponseEntity<>("Deleted",HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
