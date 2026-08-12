package com.smartcampus.energy_management.controller;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system")
public class SystemStatusController {

    private final DataSource dataSource;

    public SystemStatusController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/status")
    public Map<String, String> getStatus() {

        Map<String, String> status = new HashMap<>();

        try (Connection connection = dataSource.getConnection()) {

            if (connection.isValid(2)) {
                status.put("system", "RUNNING");
                status.put("database", "CONNECTED");
            } else {
                status.put("system", "ERROR");
                status.put("database", "DISCONNECTED");
            }

        } catch (Exception e) {

            status.put("system", "ERROR");
            status.put("database", "DISCONNECTED");
        }

        return status;
    }
}