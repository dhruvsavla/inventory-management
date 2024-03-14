import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Item.css"
import Header from "./Header"
import { Container } from 'react-bootstrap';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as XLSX from 'xlsx';
import Table from 'react-bootstrap/Table';

function Stock() {
  const [validated, setValidated] = useState(false);

  const [date, setDate] = useState("");
  const [skucode, setSkucode] = useState("");
  const [addQty, setAddQty] = useState("");
  const [subQty, setSubQty] = useState("");
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
                date: item.date,
                skucode: item.skucode,
                addQty: item.addQty,
                subQty: item.subQty
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
    axios.get(`http://localhost:8080/items/${skucode}`)
      .then(response => {
        if (response.data) {
          const item = response.data;
          const formData = {
            date,
            skucode,
            addQty,
            subQty,
            item: item
          };
          console.log('form data: ', formData);
          axios.post('http://localhost:8080/stock', formData)
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
      date, 
      skucode,
      addQty,
      subQty
    };
    console.log('form data: ', formData)
    console.log("id: ", selectedItem.supplierId)
    axios.put(`http://localhost:8080/supplier/${selectedItem.supplierId}`, formData)
      .then(response => {
        
        console.log('PUT request successful:', response);
        setValidated(false);
        setRowSelected(false);
        setAddQty(""); 
        setSkucode("");
        setAddQty("");
        setSubQty("")
      })
      .catch(error => {
        console.error('Error sending PUT request:', error);
      });
  }
};



const handleRowClick = (stock) => {
  setDate(stock.date);
  setSkucode(stock.skucode);
  setAddQty(stock.addQty);
  setSubQty(stock.subQty);
  setRowSelected(true);
  setSelectedItem(stock);
};

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase
};

useEffect(() => {
  axios.get('http://localhost:8080/stock') 
    .then(response => setApiData(response.data))
    .catch(error => console.error(error));
    console.log(apiData)
}, []);

const postData = (data) => {
    axios.post('http://localhost:8080/stock', data)
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
                    <h1>Stock</h1>
            </div>
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Date</Form.Label>
          <Form.Control
             required
             type="text"
             placeholder="Date"
             name="Date"
             value={date}
             onChange={(e) => setDate(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>SKUcode</Form.Label>
          <Form.Control
             required
             type="text"
             placeholder="SKUCode"
             name="SKUCode"
             value={skucode}
             onChange={(e) => setSkucode(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>AddQty</Form.Label>
          <Form.Control
             required
             type="text"
             placeholder="AddQty"
             name="AddQty"
             value={addQty}
             onChange={(e) => setAddQty(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>SubQty</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="SubQty"
            name="SubQty"
            value={subQty}
            onChange={(e) => setSubQty(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
        </Row>
                    
      <Button type="submit">Submit form</Button>
            </Form>
      
            <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{ backgroundColor: '#E5E7E9' }} 
        >
          <h4>List View of Bom</h4>
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
                  <th>SKUCode</th>
                  <th>AddQty</th>
                  <th>SubQty</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map(stock => (
                <tr key={stock.id} onClick={() => handleRowClick(stock)}>
                  <td>{stock.date}</td>
                  <td>{stock.skucode}</td>
                  <td>{stock.addQty}</td>
                  <td>{stock.subQty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AccordionDetails>
      </Accordion>
                
            </div>
  );
}

export default Stock;