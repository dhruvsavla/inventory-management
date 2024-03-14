package com.example.inventorygenius.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;
    @Column(name = "Date")
    private Date Date;
    @Column(name = "order_no")
    private String orderNo;
    @Column(name = "portal")
    private String portal;
    @Column(name = "portal_order_no")
    private String portalOrderNo;
    @Column(name = "portal_order_line_id")
    private String portalOrderLineId;
    @Column(name = "portal_sku")
    private String portalSKU;
    @Column(name = "seller_sku")
    private String sellerSKU;
    @Column(name = "product_description")
    private String productDescription;
    @Column(name = "quantity")
    private int qty;
    @Column(name = "ship_by_date")
    private Date shipByDate;
    @Column(name = "dispatched")
    private boolean dispatched;
    @Column(name = "courier")
    private String courier;

    @ManyToMany()
    @JoinTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"), inverseJoinColumns = @JoinColumn(name = "item_id"))
    private List<Item> items = new ArrayList<>();

    public Order() {

    }

    public Order(Long orderId, String orderNo, String portal, String portalOrderNo, String portalOrderLineId,
            String portalSKU, String sellerSKU, String productDescription, int qty, Date shipByDate, boolean dispatched,
            String courier) {
        this.orderId = orderId;
        this.orderNo = orderNo;
        this.portal = portal;
        this.portalOrderNo = portalOrderNo;
        this.portalOrderLineId = portalOrderLineId;
        this.portalSKU = portalSKU;
        this.sellerSKU = sellerSKU;
        this.productDescription = productDescription;
        this.qty = qty;
        this.shipByDate = shipByDate;
        this.dispatched = dispatched;
        this.courier = courier;

    }

    public Long getOrderId() {
        return orderId;
    }

    // public List<OrderItem> getOrderItems() {
    // return orderItems;
    // }

    // public void setOrderItems(List<OrderItem> orderItems) {
    // this.orderItems = orderItems;
    // }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getPortal() {
        return portal;
    }

    public void setPortal(String portal) {
        this.portal = portal;
    }

    public String getPortalOrderNo() {
        return portalOrderNo;
    }

    public void setPortalOrderNo(String portalOrderNo) {
        this.portalOrderNo = portalOrderNo;
    }

    public String getPortalOrderLineId() {
        return portalOrderLineId;
    }

    public void setPortalOrderLineId(String portalOrderLineId) {
        this.portalOrderLineId = portalOrderLineId;
    }

    public String getPortalSKU() {
        return portalSKU;
    }

    public void setPortalSKU(String portalSKU) {
        this.portalSKU = portalSKU;
    }

    public String getSellerSKU() {
        return sellerSKU;
    }

    public void setSellerSKU(String sellerSKU) {
        this.sellerSKU = sellerSKU;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public Date getShipByDate() {
        return shipByDate;
    }

    public void setShipByDate(Date shipByDate) {
        this.shipByDate = shipByDate;
    }

    public boolean isDispatched() {
        return dispatched;
    }

    public Date getDate() {
        return Date;
    }

    public void setDate(Date date) {
        Date = date;
    }

    public void setDispatched(boolean dispatched) {
        this.dispatched = dispatched;
    }

    public String getCourier() {
        return courier;
    }

    public void setCourier(String courier) {
        this.courier = courier;
    }
}
