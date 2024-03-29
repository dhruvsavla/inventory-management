package com.example.inventorygenius.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.inventorygenius.entity.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Supplier findBySupplierName(String name);
}
