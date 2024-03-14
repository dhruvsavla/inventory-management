package com.example.inventorygenius.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventorygenius.entity.Item;
import com.example.inventorygenius.entity.Stock;
import com.example.inventorygenius.repository.StockRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    // Method to add a new item
    public Stock addStock(Stock stock) {
        return stockRepository.save(stock);
    }

    // Method to get all items
    public List<Stock> getAllStock() {
        return stockRepository.findAll();
    }

}
