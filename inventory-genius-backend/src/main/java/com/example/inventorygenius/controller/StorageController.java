package com.example.inventorygenius.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.inventorygenius.entity.Storage;
import com.example.inventorygenius.service.StorageService;

import java.util.List;

@RestController
@RequestMapping("/storage")
public class StorageController {

    @Autowired
    private StorageService storageService;

    @PostMapping
    public ResponseEntity<Storage> addStorage(@RequestBody Storage storage) {
        Storage newStorage = storageService.addStorage(storage);
        return new ResponseEntity<>(newStorage, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Storage>> getAllStorage() {
        List<Storage> storage = storageService.getAllStorage();
        return new ResponseEntity<>(storage, HttpStatus.OK);
    }
}
