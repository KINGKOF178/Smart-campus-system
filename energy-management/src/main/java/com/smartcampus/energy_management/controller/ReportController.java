package com.smartcampus.energy_management.controller;

import com.smartcampus.energy_management.entity.Device;
import com.smartcampus.energy_management.repository.BuildingRepository;
import com.smartcampus.energy_management.repository.DeviceRepository;
import com.smartcampus.energy_management.repository.FloorRepository;
import com.smartcampus.energy_management.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:5173"
})

public class ReportController {

    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;
    private final DeviceRepository deviceRepository;

    public ReportController(
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
    public Map<String, Object> getReport() {

        Map<String, Object> report = new HashMap<>();

        report.put("buildings", buildingRepository.count());
        report.put("floors", floorRepository.count());
        report.put("rooms", roomRepository.count());
        report.put("devices", deviceRepository.count());

        // Total installed power (Watts)
        double totalPower = deviceRepository.findAll()
                .stream()
                .mapToDouble(Device::getPowerRating)
                .sum();

        // Total daily energy (kWh)
        double totalEnergyKwh = deviceRepository.findAll()
                .stream()
                .mapToDouble(d -> (d.getPowerRating() * d.getHoursPerDay()) / 1000)
                .sum();

        // Electricity tariff
        double tariff = 0.15;

        // Cost calculations
        double dailyCost = totalEnergyKwh * tariff;
        double monthlyCost = dailyCost * 30;

        report.put("totalPower", totalPower);
        report.put("totalEnergyKwh", totalEnergyKwh);
        report.put("dailyCost", dailyCost);
        report.put("monthlyCost", monthlyCost);

        return report;
    }

    @GetMapping("/building-energy")
    public List<Map<String, Object>> getBuildingEnergy() {

        Map<String, Double> buildingTotals = new HashMap<>();

        for (Device device : deviceRepository.findAll()) {

            double energy =
                    (device.getPowerRating() * device.getHoursPerDay()) / 1000.0;

            buildingTotals.merge(device.getBuilding(), energy, Double::sum);
        }

        List<Map<String, Object>> result = new ArrayList<>();

        buildingTotals.entrySet()
                .stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .forEach(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", entry.getKey());
                    item.put("kwh", entry.getValue());
                    result.add(item);
                });

        return result;
    }
}