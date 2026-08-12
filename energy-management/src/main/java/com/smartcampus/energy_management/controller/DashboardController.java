package com.smartcampus.energy_management.controller;

import com.smartcampus.energy_management.repository.BuildingRepository;
import com.smartcampus.energy_management.repository.DeviceRepository;
import com.smartcampus.energy_management.repository.FloorRepository;
import com.smartcampus.energy_management.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost", "http://localhost:5173"})
public class DashboardController {

    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;
    private final DeviceRepository deviceRepository;

    public DashboardController(
            BuildingRepository buildingRepository,
            FloorRepository floorRepository,
            RoomRepository roomRepository,
            DeviceRepository deviceRepository) {

        this.buildingRepository = buildingRepository;
        this.floorRepository = floorRepository;
        this.roomRepository = roomRepository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboardData() {

        Map<String, Object> data = new HashMap<>();

        data.put("buildings", buildingRepository.count());
        data.put("floors", floorRepository.count());
        data.put("rooms", roomRepository.count());
        data.put("devices", deviceRepository.count());

        // Total daily energy (kWh)
        double totalEnergyKwh = deviceRepository.findAll()
                .stream()
                .mapToDouble(d -> (d.getPowerRating() * d.getHoursPerDay()) / 1000)
                .sum();

        // Cost calculations
        double tariff = 0.15;
        double dailyCost = totalEnergyKwh * tariff;
        double monthlyCost = dailyCost * 30;

        data.put("totalEnergyKwh", totalEnergyKwh);
        data.put("dailyCost", dailyCost);
        data.put("monthlyCost", monthlyCost);

        return data;
    }
}