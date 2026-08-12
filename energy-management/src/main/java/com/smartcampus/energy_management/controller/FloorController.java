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

import com.smartcampus.energy_management.entity.Floor;
import com.smartcampus.energy_management.entity.Room;
import com.smartcampus.energy_management.repository.DeviceRepository;
import com.smartcampus.energy_management.repository.FloorRepository;
import com.smartcampus.energy_management.repository.RoomRepository;

@RestController
@RequestMapping("/api/floors")
@CrossOrigin(origins = {"http://localhost", "http://localhost:5173"})
public class FloorController {

    private final FloorRepository repository;
    private final RoomRepository roomRepository;
    private final DeviceRepository deviceRepository;

    public FloorController(
            FloorRepository repository,
            RoomRepository roomRepository,
            DeviceRepository deviceRepository) {

        this.repository = repository;
        this.roomRepository = roomRepository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public List<Floor> getAllFloors() {
        return repository.findAll();
    }

    @PostMapping
    public Floor addFloor(@RequestBody Floor floor) {
        return repository.save(floor);
    }

    @PutMapping("/{id}")
public Floor updateFloor(
        @PathVariable Long id,
        @RequestBody Floor updatedFloor) {

    Floor floor = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Floor not found"));

    String oldBuilding = floor.getBuilding();
    int oldFloorNumber = floor.getFloorNumber();

    String newBuilding = updatedFloor.getBuilding();
    int newFloorNumber = updatedFloor.getFloorNumber();

    // Update rooms belonging to the old floor
    roomRepository.findAll().stream()
            .filter(room ->
                    oldBuilding.equals(room.getBuilding())
                    && room.getFloor() == oldFloorNumber)
            .forEach(room -> {
                room.setBuilding(newBuilding);
                room.setFloor(newFloorNumber);
                roomRepository.save(room);
            });

    // Update devices belonging to rooms on the old floor
    deviceRepository.findAll().stream()
            .filter(device -> oldBuilding.equals(device.getBuilding()))
            .forEach(device -> {
                device.setBuilding(newBuilding);
                deviceRepository.save(device);
            });

    // Finally update the floor itself
    floor.setBuilding(newBuilding);
    floor.setFloorNumber(newFloorNumber);

    return repository.save(floor);
}

    @DeleteMapping("/{id}")
    public void deleteFloor(@PathVariable Long id) {

        Floor floor = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Floor not found"));

        String building = floor.getBuilding();
        int floorNumber = floor.getFloorNumber();

        // Delete all devices in rooms on this floor
        for (Room room : roomRepository.findAll()) {

            if (room.getBuilding().equals(building)
                    && room.getFloor() == floorNumber) {

                deviceRepository.findAll().stream()
                        .filter(device ->
                                device.getBuilding().equals(building)
                                        && device.getRoom().equals(room.getRoomName()))
                        .forEach(deviceRepository::delete);

                roomRepository.delete(room);
            }
        }

        // Delete the floor
        repository.delete(floor);
    }
}