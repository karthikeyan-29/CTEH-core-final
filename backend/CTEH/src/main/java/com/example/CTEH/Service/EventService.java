package com.example.CTEH.Service;

import com.example.CTEH.Model.Event;
import com.example.CTEH.Repo.Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {
  @Autowired
    private Repo repo;
     public List<Event> getAllEvents(){
         return repo.findAll();
     }
    public Event createEvent(Event event, MultipartFile imageFile) throws IOException {
        event.setImageName(imageFile.getOriginalFilename());
        event.setImageType(imageFile.getContentType());
        event.setImageData(imageFile.getBytes());

        return repo.save(event);
    }
    public List<Event> getAll(){
         return repo.findAll();
    }
//    public Event getProduct(int id) {
//        return repo.findById(id).orElse(null);
//    }
    public Optional<Event> getEventById(int id){
         return repo.findById(id);
    }
    public List<Event> searchEvents(String query) {
        String lowerQuery = query.toLowerCase();
        return repo.findAll().stream()
                .filter(event ->
                        event.getEventName().toLowerCase().contains(lowerQuery) ||
                                event.getUniversityName().toLowerCase().contains(lowerQuery)
                                || event.getCreatorName().toLowerCase().contains(lowerQuery)
                )
                .collect(Collectors.toList());
    }
   public boolean deleteEvent(int id){
         Optional<Event> events=repo.findById(id);
         if(events.isPresent()){
             repo.deleteById(id);
             return true;
         }
         return false;
   }
}
