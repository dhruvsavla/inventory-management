import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import "./Item.css"
import Header from "./Header"
import * as XLSX from 'xlsx';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Supplier() {
  const [validated, setValidated] = useState(false);
  const [phonel, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [supplierName, setName] = useState("");
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
                address: item.address,
                phonel: item.phone,
                supplierName: item.supplier_name
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
    const formData = {
      phonel, 
      address,
      supplierName,
    };

    axios.post('http://localhost:8080/supplier' , formData)
      .then(response => {
        console.log('POST request successful:', response);
        console.log('form data: ', formData)
        setValidated(false);
        setApiData([...apiData, response.data]); // Add the newly created/updated item to the apiData array
      })
      .catch(error => {
        console.error('Error sending POST request:', error);
      });
  }

  setValidated(true);
};

const handleRowSubmit = () => {
  console.log("handleRowSubmit triggered");
  console.log(selectedItem)
  if (rowSelected && selectedItem) {
    const formData = {
      phonel,
      address,
      supplierName
    };
    console.log('form data: ', formData)
    console.log("id: ", selectedItem.supplierId)
    axios.put(`http://localhost:8080/supplier/${selectedItem.supplierId}`, formData)
      .then(response => {
        
        console.log('PUT request successful:', response);
        setValidated(false);
        setRowSelected(false);
        setPhone("");
        setAddress("");
        setName("");
      })
      .catch(error => {
        console.error('Error sending PUT request:', error);
      });
  }
};



const handleRowClick = (supplier) => {
  setAddress(supplier.address);
  setPhone(supplier.phone);
  setName(supplier.supplierName);
  setRowSelected(true);
  setSelectedItem(supplier);
};

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase
};

useEffect(() => {
  axios.get('http://localhost:8080/supplier') 
    .then(response => setApiData(response.data))
    .catch(error => console.error(error));
}, []);

const postData = (data) => {
    axios.post('http://localhost:8080/supplier', data)
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
          <h1>Supplier</h1>
        </div>
      
        <Accordion defaultExpanded>
        <AccordionSummary className='acc-summary'
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{ backgroundColor: '#E5E7E9' }} 
        >
          <h4>Supplier Form</h4>
        </AccordionSummary>
        <AccordionDetails>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Name</Form.Label>
              <Form.Control
                  required
                  type="text"
                  placeholder="Supplier Name"
                  name="supplierName"
                  value={supplierName}
                  onChange={(e) => setName(e.target.value)}
                />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Adress</Form.Label>
          <Form.Control
                  required
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Phone</Form.Label>
          <Form.Control
                  required
                  type="text"
                  placeholder="phonel"
                  name="phonel"
                  value={phonel}
                  onChange={(e) => setPhone(e.target.value)}
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
                <th>Name</th>
                <th>Adress</th>
                <th>Phone No</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map(supplier => (
                <tr key={supplier.id} onClick={() => handleRowClick(supplier)}>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.phonel}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AccordionDetails>
      </Accordion>
            </div>
  );
}

export default Supplier;