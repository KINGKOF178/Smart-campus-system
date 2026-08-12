package com.smartcampus.energy_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String building;
    private String room;
    private String deviceName;
    private double powerRating;
    private double hoursPerDay;

    public Device() {
}

public Device(String building, String room, String deviceName,
              double powerRating, double hoursPerDay) {

    this.building = building;
    this.room = room;
    this.deviceName = deviceName;
    this.powerRating = powerRating;
    this.hoursPerDay = hoursPerDay;
}

    public Long getId() {
        return id;
    }

    public String getBuilding() {
        return building;
    }
    
    public void setBuilding(String building) {
        this.building = building;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public double getPowerRating() {
        return powerRating;
    }

    public void setPowerRating(double powerRating) {
        this.powerRating = powerRating;
    }

    public double getHoursPerDay() {
    return hoursPerDay;
}

public void setHoursPerDay(double hoursPerDay) {
    this.hoursPerDay = hoursPerDay;
}
}