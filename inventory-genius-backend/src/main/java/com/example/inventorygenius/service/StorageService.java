package com.example.inventorygenius.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventorygenius.entity.Storage;
import com.example.inventorygenius.entity.Item;
import com.example.inventorygenius.repository.StorageRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class StorageService {

    @Autowired
    private StorageRepository storageRepository;

    public Storage addStorage(Storage storage) {
        List<Item> newItems = new ArrayList<>();
        for (Item item : storage.getItemsInStorage()) {
            if (item.getItemId() == null) { // Check if item is new
                newItems.add(item);
            }
        }

        return storageRepository.save(storage);
    }

    public List<Storage> getAllStorage() {
        return storageRepository.findAll();
    }

}
