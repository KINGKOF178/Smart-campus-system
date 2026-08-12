package com.smartcampus.energy_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "floors")
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String building;

    private int floorNumber;

    public Floor() {
    }

    public Floor(String building, int floorNumber) {
        this.building = building;
        this.floorNumber = floorNumber;
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

    public int getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(int floorNumber) {
        this.floorNumber = floorNumber;
    }
}