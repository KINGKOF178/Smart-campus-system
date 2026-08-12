package com.smartcampus.energy_management.repository;

import com.smartcampus.energy_management.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Long> {
}