package com.example.inventorygenius.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventorygenius.entity.Item;
import com.example.inventorygenius.entity.Order;
import com.example.inventorygenius.repository.OrderRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Method to add a new item
    public Order addOrder(Order order) {
        // Create new Item entities within the transaction
        List<Item> newItems = new ArrayList<>();
        for (Item item : order.getItems()) {
            if (item.getItemId() == null) { // Check if item is new
                newItems.add(item);
            }
        }

        // Now you can safely persist the Order entity
        return orderRepository.save(order);
    }

    // Method to get all items
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

}
