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

import com.smartcampus.energy_management.entity.Room;
import com.smartcampus.energy_management.repository.DeviceRepository;
import com.smartcampus.energy_management.repository.RoomRepository;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = {"http://localhost", "http://localhost:5173"})
public class RoomController {

    private final RoomRepository repository;
    private final DeviceRepository deviceRepository;

    public RoomController(
            RoomRepository repository,
            DeviceRepository deviceRepository) {

        this.repository = repository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return repository.findAll();
    }

    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return repository.save(room);
    }

    @PutMapping("/{id}")
public Room updateRoom(
        @PathVariable Long id,
        @RequestBody Room updatedRoom) {

    Room room = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found"));

    String oldBuilding = room.getBuilding();
    String oldRoomName = room.getRoomName();

    String newBuilding = updatedRoom.getBuilding();
    String newRoomName = updatedRoom.getRoomName();

    // Update devices belonging to this room
    deviceRepository.findAll().stream()
            .filter(device ->
                    oldBuilding.equals(device.getBuilding())
                            && oldRoomName.equals(device.getRoom()))
            .forEach(device -> {
                device.setBuilding(newBuilding);
                device.setRoom(newRoomName);
                deviceRepository.save(device);
            });

    // Update the room itself
    room.setBuilding(newBuilding);
    room.setFloor(updatedRoom.getFloor());
    room.setRoomName(newRoomName);

    return repository.save(room);
}

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {

        Room room = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Delete all devices in this room
        deviceRepository.findAll().stream()
                .filter(device ->
                        device.getBuilding().equals(room.getBuilding())
                                && device.getRoom().equals(room.getRoomName()))
                .forEach(deviceRepository::delete);

        // Delete the room
        repository.delete(room);
    }
}