import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Item.css"
import { Table } from 'react-bootstrap';
import Header from "./Header"
import * as XLSX from 'xlsx';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ImportOrderForm() {
  const [validated, setValidated] = useState(false);
  const [Date, setDate] = useState("");
  const [orderNo, setOrderno] = useState("");
  const [portalOrderNo, setPortalOrderno] = useState("");
  const [portalOrderLineId, setPortalOrderLineid] = useState("");
  const [portalSKU, setPortalSKU] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [shipByDate, setShipbyDate] = useState("");
  const [dispatched, setDispatched] = useState(false);
  const [courier, setCourier] = useState("");
  const [portal, setPortal] = useState("");
  const [sellerSKU, setSellerSKU] = useState("");
  const [qty, setQuantity] = useState("");
  const [apiData, setApiData] = useState([]); 
  const [rowSelected, setRowSelected] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        jsonData.shift();

        jsonData.forEach(item => {
            const formattedData = {
                // bin: item.binNumber,
                // rack: item.rackNumber,
                // skucde: item.skucode
            };
          console.log(formattedData)
            postData(formattedData);
        });
    };

    reader.readAsBinaryString(file);
};

const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Fetch item based on supplier and supplier SKU code
      axios.get(`http://localhost:8080/items/order/${sellerSKU}/${productDescription}`)
        .then(response => {
          if (response.data) {
            const itemsArray = []; // Initialize an array to store items
            itemsArray.push(response.data);
            const formData = {
              Date,
              orderNo,
              portalOrderNo,
              portalOrderLineId,
              portalSKU,
              productDescription,
              shipByDate,
              dispatched,
              courier,
              portal,
              sellerSKU,
              qty,
              items: itemsArray
            };
            console.log('form data: ', formData);
            axios.post('http://localhost:8080/orders', formData)
              .then(response => {
                console.log('POST request successful:', response);
                setValidated(false);
                setApiData([...apiData, response.data]);
              })
              .catch(error => {
                console.error('Error sending POST request:', error);
              });
          } else {
            console.error('No item found for the specified supplier and supplier SKU code.');
          }
        })
        .catch(error => {
          console.error('Error fetching item:', error);
        });
    }
  
    setValidated(true);
  };

const handleRowSubmit = () => {
  console.log("handleRowSubmit triggered");
  console.log(selectedItem)
  if (rowSelected && selectedItem) {
    const formData = {
      Date,
      orderNo,
      portalOrderNo,
      portalOrderLineId,
      portalSKU,
      productDescription,
      shipByDate,
      dispatched,
      courier,
      portal,
      sellerSKU,
      qty,
    };
    console.log('form data: ', formData)
    console.log("id: ", selectedItem.supplierId)
    axios.put(`http://localhost:8080/orders`, formData)
      .then(response => {
        
        console.log('PUT request successful:', response);
        setValidated(false);
        setRowSelected(false);
        setDate("");
        setOrderno("");
        setPortalOrderno("");
        setPortalOrderLineid("");
        setPortal("");
        setPortalSKU("");
        setProductDescription("");
        setCourier("");
        setDispatched("");
        setQuantity("");
        setSellerSKU("");
        setShipbyDate("");
      })
      .catch(error => {
        console.error('Error sending PUT request:', error);
      });
  }
};



const handleRowClick = (order) => {
  // setDate(order.);
  //       setOrderno("");
  //       setPortalOrderno("");
  //       setPortalOrderLineid("");
  //       setPortal("");
  //       setPortalSKU("");
  //       setProductDescription("");
  //       setCourier("");
  //       setDispatched("");
  //       setQuantity("");
  //       setSellerSKU("");
  //       setShipbyDate("");
  // setRowSelected(true);
  // setSelectedItem(storage);
};

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase
};

useEffect(() => {
  axios.get('http://localhost:8080/orders') 
    .then(response => setApiData(response.data))
      .catch(error => console.error(error));
    console.log(apiData)
}, []);

const postData = (data) => {
    axios.post('http://localhost:8080/orders', data)
        .then(response => {
            // Handle successful response
            console.log('Data posted successfully:', response);
        })
        .catch(error => {
            // Handle error
            console.error('Error posting data:', error);
        });
};

    return (
        <div>
            <div className='title'>
                    <h1>Import Order Form</h1>
                </div>
                <Accordion defaultExpanded>
        <AccordionSummary className='acc-summary'
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{ backgroundColor: '#E5E7E9' }} 
        >
          <h4>Storage Form</h4>
        </AccordionSummary>
        <AccordionDetails>
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Date</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Date"
            defaultValue=""
            value={Date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Order No</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Order No"
                  defaultValue=""
                  value={orderNo}
                onChange={(e) => setOrderno(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Portal OrderNo</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Portal OrderNo"
                  defaultValue=""
                  value={portalOrderNo}
                onChange={(e) => setPortalOrderno(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Portal OrderLineid</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Portal OrderLineid"
                  defaultValue=""
                  value={portalOrderLineId}
                  onChange={(e) => setPortalOrderLineid(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Portal SKU</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Portal SKU"
                  defaultValue=""
                  value={portalSKU}
                  onChange={(e) => setPortalSKU(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
        </Row>

         <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Seller SKU</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Seller SKU"
                  defaultValue=""
                  value={sellerSKU}
                  onChange={(e) => setSellerSKU(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Product Description"
                  defaultValue=""
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Quantity"
                  defaultValue=""
                  value={qty}
                  onChange={(e) => setQuantity(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
      </Row>            
      
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Shipby Date</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Shipby Date"
                  defaultValue=""
                  value={shipByDate}
                  onChange={(e) => setShipbyDate(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Dispatched</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Dispatched"
                  defaultValue=""
                  value={dispatched}
                  onChange={(e) => setDispatched(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Courier</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Courier"
                  defaultValue=""
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
    </Row>
                    
    <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Portal</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Portal"
                  defaultValue=""
                  value={portal}
                  onChange={(e) => setPortal(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
    </Row>
                    
    {rowSelected ? (
        <Button onClick={handleRowSubmit}>Edit</Button>
      ) : (
        <Button type="submit" onClick={handleSubmit}>Submit</Button>
      )}
            <input type="file" onChange={handleFileUpload} />
            </Form>
            </AccordionDetails>
        </Accordion>

        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{ backgroundColor: '#E5E7E9' }} 
        >
          <h4>List View of Orders</h4>
        </AccordionSummary>
        <AccordionDetails>
        <div className='search-div'>
              <Form className='search'>
                      <Form.Group className="mb-3" controlId="formSearch">
                          <Form.Label>Search from Table</Form.Label>
                          <Form.Control type="text" placeholder="Enter search text" onChange={handleSearchChange} />
                      </Form.Group>
              </Form>
          </div>
        <Table striped bordered hover>
            <thead>
                <tr>
                  <th>Date</th>
                <th>Order No</th>
                <th>PortalOrderno</th>
                  <th>PortalOrderLineid</th>
                  <th>PortalSKU</th>
                  <th>ProductDescription</th>
                  <th>ShipbyDate</th>
                  <th>Courier</th>
                  <th>Dispatched</th>
                  <th>Portal</th>
                  <th>SellerSKU</th>
                  <th>Quantity</th>

              </tr>
            </thead>
            <tbody>
              {apiData.map(order => (
                <tr key={order.id} onClick={() => handleRowClick(order)}>
                  <td>{order.Date}</td>
                  <td>{order.orderNo}</td>
                  <td>{order.portalOrderNo}</td>
                  <td>{order.portalOrderLineId}</td>
                  <td>{order.portalSKU}</td>
                  <td>{order.productDescription}</td>
                  <td>{order.shipByDate}</td>
                  <td>{order.courier}</td>
                  <td>{order.dispatched}</td>
                  <td>{order.portal}</td>
                  <td>{order.sellerSKU}</td>
                  <td>{order.qty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AccordionDetails>
      </Accordion>
  
        
        </div> 
    
  );
          
}

export default ImportOrderForm;