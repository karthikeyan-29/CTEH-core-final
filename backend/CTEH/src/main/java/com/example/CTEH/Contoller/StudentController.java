package com.example.CTEH.Contoller;




import com.example.CTEH.Model.Student;
import com.example.CTEH.Service.StudentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.annotation.DeclareError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Create a new student
    @PostMapping("/student")
    public ResponseEntity<Student> createStudent(
            @RequestPart("result") String result,
            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        // Deserialize the result JSON to a Student object
        ObjectMapper objectMapper = new ObjectMapper();
        Student student = null;
        try {
            student = objectMapper.readValue(result, Student.class);
        } catch (JsonProcessingException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Handle image file (optional, if provided)
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                student.setImageData(imageFile.getBytes());
                student.setImageName(imageFile.getOriginalFilename());
                student.setImageType(imageFile.getContentType());
            } catch (IOException e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        // Save student to database
        Student savedStudent = studentService.saveStudent(student,imageFile);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    // Get all students
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // Get student by ID
    @GetMapping("/student/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable int id) {
        Optional<Student> student = studentService.getStudentById(id);
        if (student.isPresent()) {
            return new ResponseEntity<>(student.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("/student/images/{id}")
    public ResponseEntity<byte[]> getStudentImageById(@PathVariable int id) {
        byte[] image = studentService.getStudentImageById(id);

        if (image != null) {
            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg")  // or any relevant image type
                    .body(image);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/student/email/{email}")
    public ResponseEntity<List<Student>> getStudentByEmail(@PathVariable String email) {
        List<Student> students = studentService.getStudentsByEmail(email);
        if (!students.isEmpty()) {
            return new ResponseEntity<>(students, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("student/certificateCount/{email}")
    public ResponseEntity<Integer> getCertificateCount(@PathVariable String email){
        List<Student> students=studentService.getStudentsByEmail(email);
        if(!students.isEmpty()){
            return new ResponseEntity<>(students.size(),HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("student/achievementCount/{email}")
    public ResponseEntity<Integer> getAchievementCount(@PathVariable String email) {
        List<Student> students = studentService.getStudentsByEmail(email);

        // Filter students with result = "win"
        List<Student> winners = students.stream()
                .filter(student -> "Win".equalsIgnoreCase(student.getResult().trim()))
                .toList();

        if (!winners.isEmpty()) {
            return new ResponseEntity<>(winners.size(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    //get student achievement certifications
    @GetMapping("student/achievements/{email}")
    public ResponseEntity<List<Student>> getAchievements(@PathVariable String email) {
        List<Student> students = studentService.getStudentsByEmail(email);

        // Filter students with result = "win"
        List<Student> achievement = students.stream()
                .filter(student -> "Win".equalsIgnoreCase(student.getResult().trim()))
                .toList();

        if (!achievement.isEmpty()) {
            return new ResponseEntity<>(achievement, HttpStatus.OK);
        }
        return new ResponseEntity<>(Collections.emptyList(),HttpStatus.OK);
    }
    @GetMapping("student/participation/{email}")
    public ResponseEntity<List<Student>> getParticipations(@PathVariable String email) {
        List<Student> students = studentService.getStudentsByEmail(email);

        // Filter students with result = "win"
        List<Student> achievement = students.stream()
                .filter(student -> "Participated".equalsIgnoreCase(student.getResult().trim()))
                .toList();

        if (!achievement.isEmpty()) {
            return new ResponseEntity<>(achievement, HttpStatus.OK);
        }
        return new ResponseEntity<>(Collections.emptyList(),HttpStatus.OK);
    }
    @DeleteMapping("student/deleteByEmail")
    public ResponseEntity<String> deleteByEmail(@RequestParam String email){
        studentService.deleteStudentsByEmail(email);
        return new ResponseEntity<>("User data deleted",HttpStatus.OK);
    }
    @DeleteMapping("student/deleteCert/{id}")
    public ResponseEntity<String>  deleteCertificateById(@PathVariable int id){
        boolean isDeleted=studentService.deleteCertificateById(id);
        if(isDeleted){
            return new ResponseEntity<>("Deleted",HttpStatus.OK);
        }
        return new ResponseEntity<>("Not Deleted",HttpStatus.INTERNAL_SERVER_ERROR);
    }




//    @GetMapping("student/participations/{email}")
//    public ResponseEntity<List<Student>> getStudentParticipations(@PathVariable String email){
//        List<Student> student=studentService.getStudentsByEmail(email);
//        List<Student> participated=student.stream()
//                .filter(participation -> "participated".equalsIgnoreCase(participation.getResult().trim()))
//                .toList();
//        if(!participated.isEmpty()){
//            return new ResponseEntity<>(participated,HttpStatus.OK);
//        }
//        return new ResponseEntity<>(Collections.emptyList(),HttpStatus.OK);
//
//    }


//    // Update student by ID
//    @PutMapping("/{id}")
//    public ResponseEntity<Student> updateStudent(@PathVariable int id, @RequestBody Student student) {
//        Student updatedStudent = studentService.updateStudent(id, student);
//        if (updatedStudent != null) {
//            return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
//
//    // Delete student by ID
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteStudent(@PathVariable int id) {
//        studentService.deleteStudent(id);
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }
}
