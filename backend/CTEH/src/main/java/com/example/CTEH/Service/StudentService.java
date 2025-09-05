package com.example.CTEH.Service;




import com.example.CTEH.Model.Student;

import com.example.CTEH.Repo.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepo studentRepository;

    // Save student record
    public Student saveStudent(Student student, MultipartFile imageFile)throws IOException {
        student.setImageType(imageFile.getContentType());
        student.setImageName(imageFile.getOriginalFilename());
        student.setImageData(imageFile.getBytes());
        return studentRepository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Optional<Student> getStudentById(int id) {
        return studentRepository.findById(id);
    }

    public byte[] getStudentImageById(int id) {
        Optional<Student> student = studentRepository.findById(id);

        // Get the image data from the student entity
        return student.map(Student::getImageData).orElse(null);
    }
    public List<Student> getStudentsByEmail(String email) {
        return studentRepository.findByCollegeEmail(email);
    }



    // Update student record
    public Student updateStudent(int id, Student student) {
        if (studentRepository.existsById(id)) {
            student.setId(id);
            return studentRepository.save(student);
        }
        return null;
    }

    // Delete student record
    public void deleteStudent(int id) {
        studentRepository.deleteById(id);
    }
    public void deleteStudentsByEmail(String email) {
        studentRepository.deleteAllByCollegeEmail(email);
    }
    public boolean deleteCertificateById(int id){
        Optional<Student> student=studentRepository.findById(id);
        if(student.isPresent()){
            studentRepository.deleteById(id);
            return true;
        }
        return false;

    }

}
