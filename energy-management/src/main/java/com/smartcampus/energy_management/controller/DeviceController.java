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

import com.smartcampus.energy_management.entity.Device;
import com.smartcampus.energy_management.repository.DeviceRepository;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = {
        "http://localhost",
        "http://localhost:5173",
        "http://127.0.0.1",
        "http://127.0.0.1:5173"
})
public class DeviceController {

    private final DeviceRepository repository;

    public DeviceController(DeviceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Device> getAllDevices() {
        return repository.findAll();
    }

    @PostMapping
    public Device addDevice(@RequestBody Device device) {
        return repository.save(device);
    }

    @PutMapping("/{id}")
    public Device updateDevice(@PathVariable Long id, @RequestBody Device updatedDevice) {

        Device device = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        device.setBuilding(updatedDevice.getBuilding());
        device.setRoom(updatedDevice.getRoom());
        device.setDeviceName(updatedDevice.getDeviceName());
        device.setPowerRating(updatedDevice.getPowerRating());
        device.setHoursPerDay(updatedDevice.getHoursPerDay());

        return repository.save(device);
    }

    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable Long id) {
        repository.deleteById(id);
    }
}