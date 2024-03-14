package com.example.inventorygenius.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventorygenius.entity.Item;
import com.example.inventorygenius.entity.Supplier;
import com.example.inventorygenius.repository.ItemRepository;
import com.example.inventorygenius.repository.SupplierRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    // Method to add a new item
    public Item addItem(Long supplierId, Item item) {
        Supplier supplier = supplierRepository.findById(supplierId).orElse(null);
        if (supplier != null) {
            item.setSupplier(supplier);
            return itemRepository.save(item);
        } else {
            // Handle supplier not found
            return null;
        }
    }

    // Method to get all items
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Long itemId) {
        return itemRepository.findById(itemId);
    }

    public Item updateItem(Item updatedItem) {
        Long itemId = updatedItem.getItemId(); // Assuming you have a method to get the item ID
        Optional<Item> optionalItem = itemRepository.findById(itemId);
        if (optionalItem.isPresent()) {
            Item existingItem = optionalItem.get();
            existingItem.setSupplier(updatedItem.getSupplier());
            existingItem.setSKUCode(updatedItem.getSKUCode());
            existingItem.setDescription(updatedItem.getDescription());
            existingItem.setPackOf(updatedItem.getPackOf());
            // Set other fields similarly
            return itemRepository.save(existingItem);
        } else {
            // Handle case when item with given ID is not found
            // You can throw an exception or return null, depending on your preference
            return null;
        }
    }

    public Item getItemBySkuCode(String skuCode) {
        return itemRepository.findBySKUCode(skuCode);
    }

    public Item getItemBySupplierSKUCodeAndSupplierName(String supplierSKUCode, String supplierName) {
        return itemRepository.findBySellerSKUCodeAndSupplier_supplierName(supplierSKUCode, supplierName);
    }

    public Item getItemBySupplierAndDescription(String supplierSkuCode, String description) {
        // Call the repository or service method to fetch the item by supplierSkuCode
        // and portalSkuCode
        return itemRepository.findBySellerSKUCodeAndDescription(supplierSkuCode, description);
    }

}
