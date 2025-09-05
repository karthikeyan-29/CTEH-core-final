package com.example.CTEH.Repo;

import com.example.CTEH.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepo  extends JpaRepository<Student, Integer> {
    List<Student> findByCollegeEmail(String collegeEmail);
    void deleteAllByCollegeEmail(String collegeEmail);


}
