package com.smartcampus.energy_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.energy_management.entity.Building;
import com.smartcampus.energy_management.repository.BuildingRepository;
import com.smartcampus.energy_management.repository.DeviceRepository;
import com.smartcampus.energy_management.repository.FloorRepository;
import com.smartcampus.energy_management.repository.RoomRepository;

@RestController
@RequestMapping("/api/buildings")
@CrossOrigin(origins = {"http://localhost", "http://localhost:5173"})
public class BuildingController {

    private final BuildingRepository repository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;
    private final DeviceRepository deviceRepository;

    public BuildingController(
            BuildingRepository repository,
            FloorRepository floorRepository,
            RoomRepository roomRepository,
            DeviceRepository deviceRepository) {

        this.repository = repository;
        this.floorRepository = floorRepository;
        this.roomRepository = roomRepository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public List<Building> getAllBuildings() {
        return repository.findAll();
    }

    @PostMapping
    public Building addBuilding(@RequestBody Building building) {
        return repository.save(building);
    }

    @PutMapping("/{id}")
public Building updateBuilding(
        @PathVariable Long id,
        @RequestBody Building updatedBuilding) {

    Building building = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Building not found"));

    String oldBuildingName = building.getName();
    String newBuildingName = updatedBuilding.getName();

    // Update floors belonging to this building
    floorRepository.findAll().stream()
            .filter(floor -> oldBuildingName.equals(floor.getBuilding()))
            .forEach(floor -> {
                floor.setBuilding(newBuildingName);
                floorRepository.save(floor);
            });

    // Update rooms belonging to this building
    roomRepository.findAll().stream()
            .filter(room -> oldBuildingName.equals(room.getBuilding()))
            .forEach(room -> {
                room.setBuilding(newBuildingName);
                roomRepository.save(room);
            });

    // Update devices belonging to this building
    deviceRepository.findAll().stream()
            .filter(device -> oldBuildingName.equals(device.getBuilding()))
            .forEach(device -> {
                device.setBuilding(newBuildingName);
                deviceRepository.save(device);
            });

    // Finally update the building itself
    building.setName(newBuildingName);
    building.setFloors(updatedBuilding.getFloors());

    return repository.save(building);
}

    @DeleteMapping("/{id}")
    public void deleteBuilding(@PathVariable Long id) {

        Building building = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Building not found"));

        String buildingName = building.getName();

        // Delete all devices in the building
        deviceRepository.findAll().stream()
                .filter(device -> device.getBuilding().equals(buildingName))
                .forEach(deviceRepository::delete);

        // Delete all rooms in the building
        roomRepository.findAll().stream()
                .filter(room -> room.getBuilding().equals(buildingName))
                .forEach(roomRepository::delete);

        // Delete all floors in the building
        floorRepository.findAll().stream()
                .filter(floor -> floor.getBuilding().equals(buildingName))
                .forEach(floorRepository::delete);

        // Finally delete the building
        repository.delete(building);
    }
}