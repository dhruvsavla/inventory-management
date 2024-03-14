import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PickList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/orders`);
        const orders = response.data; // Assuming response.data is an array of orders
        setOrders(orders);
        console.log(orders)
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
  }, []);

  return (
    <div>
      <div className='title'>
        <h1>PickList</h1>
      </div>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <p>Order No: {order.orderNo}</p>
            <p>Date: {order.date}</p>
            <p>SellerSKU: {order.sellerSKU}</p>
            <p>Items: {order.items.map((item, itemIndex) => (
  <span key={itemIndex}>{item.description}({item.skucode}){itemIndex !== order.items.length - 1 ? ', ' : ''}</span>
))}</p>

<p>Rack No: {order.items.map((item, itemIndex) => (
  <span key={itemIndex}>{item.storage}{itemIndex !== order.items.length - 1 ? ', ' : ''}</span>
))}</p>
            <p>Bin No: {order.binNo}</p>
            <p>Quantity: {order.qty}</p>
            <p>Portal: {order.portal}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PickList;
