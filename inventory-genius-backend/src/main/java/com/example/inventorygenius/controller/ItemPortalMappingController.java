package com.example.inventorygenius.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.inventorygenius.entity.ItemPortalMapping;
import com.example.inventorygenius.service.ItemPortalMappingService;

import java.util.List;

@RestController
@RequestMapping("/itemportalmapping")
public class ItemPortalMappingController {

    @Autowired
    private ItemPortalMappingService itemService;

    // Endpoint to add a new item
    @PostMapping
    public ResponseEntity<ItemPortalMapping> addItem(@RequestBody ItemPortalMapping itemPortalMapping) {
        ItemPortalMapping newItem = itemService.addItem(itemPortalMapping);
        return new ResponseEntity<>(newItem, HttpStatus.CREATED);
    }

    // Endpoint to get all items
    @GetMapping
    public ResponseEntity<List<ItemPortalMapping>> getAllItems() {
        List<ItemPortalMapping> items = itemService.getAllItems();
        return new ResponseEntity<>(items, HttpStatus.OK);
    }
}
