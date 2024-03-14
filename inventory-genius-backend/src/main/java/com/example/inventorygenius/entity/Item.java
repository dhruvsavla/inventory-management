package com.example.inventorygenius.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "itemId")
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "SKUCode", length = 100)
    private String SKUCode;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Packof", length = 50)
    private String packOf;

    @Column(name = "ParentSKU", length = 100)
    private String parentSKU;

    @Column(name = "Group1", length = 50)
    private String group1;

    @Column(name = "Group2", length = 50)
    private String group2;

    @Column(name = "Group3", length = 50)
    private String group3;

    @Column(name = "SizeRange", length = 50)
    private String sizeRange;

    @Column(name = "Size", length = 50)
    private String size;

    @Column(name = "Unit", length = 20)
    private String unit;

    @Column(name = "Barcode", length = 50)
    private String barcode;

    @Column(name = "SellingPrice", precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "MRP", precision = 10, scale = 2)
    private BigDecimal mrp;

    @Column(name = "SellerSKUcode", length = 100)
    private String sellerSKUCode;

    @ManyToMany(mappedBy = "items")
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();

    @ManyToMany(mappedBy = "bomItems")
    @JsonIgnore
    private List<Bom> boms = new ArrayList<>();

    @ManyToOne()
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne()
    @JoinColumn(name = "storage_id")
    private Storage storage;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private List<Stock> stockEntries = new ArrayList<>();

    public Item() {

    }

    public Item(Long itemId, String sKUCode, String description, String packOf, String parentSKU, String group1,
            String group2, String group3, String sizeRange, String size, String unit, String barcode,
            BigDecimal sellingPrice, BigDecimal mrp, String sellerSKUCode) {
        this.itemId = itemId;
        SKUCode = sKUCode;
        this.description = description;
        this.packOf = packOf;
        this.parentSKU = parentSKU;
        this.group1 = group1;
        this.group2 = group2;
        this.group3 = group3;
        this.sizeRange = sizeRange;
        this.size = size;
        this.unit = unit;
        this.barcode = barcode;
        this.sellingPrice = sellingPrice;
        this.mrp = mrp;
        this.sellerSKUCode = sellerSKUCode;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getSKUCode() {
        return SKUCode;
    }

    public void setSKUCode(String sKUCode) {
        SKUCode = sKUCode;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPackOf() {
        return packOf;
    }

    public void setPackOf(String packOf) {
        this.packOf = packOf;
    }

    public String getParentSKU() {
        return parentSKU;
    }

    public void setParentSKU(String parentSKU) {
        this.parentSKU = parentSKU;
    }

    public String getGroup1() {
        return group1;
    }

    public void setGroup1(String group1) {
        this.group1 = group1;
    }

    public String getGroup2() {
        return group2;
    }

    public void setGroup2(String group2) {
        this.group2 = group2;
    }

    public String getGroup3() {
        return group3;
    }

    public void setGroup3(String group3) {
        this.group3 = group3;
    }

    public String getSizeRange() {
        return sizeRange;
    }

    public void setSizeRange(String sizeRange) {
        this.sizeRange = sizeRange;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public BigDecimal getMrp() {
        return mrp;
    }

    public void setMrp(BigDecimal mrp) {
        this.mrp = mrp;
    }

    public String getSellerSKUCode() {
        return sellerSKUCode;
    }

    public void setSellerSKUCode(String sellerSKUCode) {
        this.sellerSKUCode = sellerSKUCode;
    }

    public List<Bom> getBoms() {
        return boms;
    }

    public void setBoms(List<Bom> boms) {
        this.boms = boms;
    }

    public Storage getStorage() {
        return storage;
    }

    public void setStorage(Storage storage) {
        this.storage = storage;
    }

    public List<Stock> getStockEntries() {
        return stockEntries;
    }

    public void setStockEntries(List<Stock> stockEntries) {
        this.stockEntries = stockEntries;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

}
