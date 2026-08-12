package com.smartcampus.energy_management.repository;

import com.smartcampus.energy_management.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, Long> {
}