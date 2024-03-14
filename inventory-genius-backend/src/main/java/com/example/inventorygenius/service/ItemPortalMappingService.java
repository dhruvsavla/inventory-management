package com.example.inventorygenius.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventorygenius.entity.ItemPortalMapping;
import com.example.inventorygenius.repository.ItemPortalMappingRepository;

import java.util.List;

@Service
public class ItemPortalMappingService {

    @Autowired
    private ItemPortalMappingRepository itemportalmappingRepository;

    // Method to add a new item
    public ItemPortalMapping addItem(ItemPortalMapping item) {
        return itemportalmappingRepository.save(item);
    }

    // Method to get all items
    public List<ItemPortalMapping> getAllItems() {
        return itemportalmappingRepository.findAll();
    }
}
