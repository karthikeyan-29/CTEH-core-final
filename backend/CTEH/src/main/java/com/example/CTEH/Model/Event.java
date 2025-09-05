package com.example.CTEH.Model;


import jakarta.persistence.*;



@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int id;

    private String eventName;

    private String universityName;

    private String eventDate;

    private String creatorName;

    private String collegeMailId;

    private long contactNumber;

    private String description;

    private String registerLink;

    private String imageName;

    private String imageType;

    @Lob
    private byte[] imageData;

    public int getId() {
        return id;
    }

    public String getEventName() {
        return eventName;
    }

    public String getUniversityName() {
        return universityName;
    }

    public String getEventDate() {
        return eventDate;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public String getCollegeMailId() {
        return collegeMailId;
    }

    public long getContactNumber() {
        return contactNumber;
    }

    public String getDescription() {
        return description;
    }

    public String getRegisterLink() {
        return registerLink;
    }

    public void setRegisterLink(String registerLink) {
        this.registerLink = registerLink;
    }

    public String getImageName() {
        return imageName;
    }

    public String getImageType() {
        return imageType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public void setCollegeMailId(String collegeMailId) {
        this.collegeMailId = collegeMailId;
    }

    public void setContactNumber(long contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
}
