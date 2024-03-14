package com.example.inventorygenius.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.inventorygenius.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
}
