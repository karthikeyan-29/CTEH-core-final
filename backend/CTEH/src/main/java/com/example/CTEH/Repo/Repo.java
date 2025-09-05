package com.example.CTEH.Repo;

import com.example.CTEH.Model.Event;
import com.example.CTEH.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Repo extends JpaRepository<Event, Integer> {

}
