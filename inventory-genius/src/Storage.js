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

function Storage() {
  const [validated, setValidated] = useState(false);
  const [binNumber, setBin] = useState("");
  const [rackNumber, setRack] = useState("");
  const [skucode, setSkucode] = useState("");
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
                bin: item.binNumber,
                rack: item.rackNumber,
                skucde: item.skucode
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
            const itemsArray = []; // Initialize an array to store items
            itemsArray.push(response.data);
            const formData = {
              binNumber,
              rackNumber,
              skucode,
              itemsInStorage: itemsArray
            };
            console.log('form data: ', formData);
            axios.post('http://localhost:8080/storage', formData)
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
      binNumber,
      rackNumber,
      skucode
    };
    console.log('form data: ', formData)
    console.log("id: ", selectedItem.supplierId)
    axios.put(`http://localhost:8080/storage`, formData)
      .then(response => {
        
        console.log('PUT request successful:', response);
        setValidated(false);
        setRowSelected(false);
        setBin("");
        setRack("");
        setSkucode("");
      })
      .catch(error => {
        console.error('Error sending PUT request:', error);
      });
  }
};



const handleRowClick = (storage) => {
  setBin(storage.binNumber);
  setRack(storage.rackNumber);
  setSkucode(storage.skucode);
  setRowSelected(true);
  setSelectedItem(storage);
};

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase
};

useEffect(() => {
  axios.get('http://localhost:8080/storage') 
    .then(response => setApiData(response.data))
      .catch(error => console.error(error));
    console.log(apiData)
}, []);

const postData = (data) => {
    axios.post('http://localhost:8080/storage', data)
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
          <h1>Storage</h1>
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
              <Form.Label>Bin No</Form.Label>
              <Form.Control
                  required
                  type="text"
                  placeholder="Bin No"
                  name="Bin No"
                  value={binNumber}
                  onChange={(e) => setBin(e.target.value)}
                />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Rack No</Form.Label>
          <Form.Control
                  required
                  type="text"
                  placeholder="Rack No"
                  name="Rack no"
                  value={rackNumber}
                  onChange={(e) => setRack(e.target.value)}
                />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>SKUCode</Form.Label>
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
          <h4>List View of Storage</h4>
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
                <th>Bin No</th>
                <th>Rack No</th>
                <th>SKUCode</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map(storage => (
                <tr key={storage.id} onClick={() => handleRowClick(storage)}>
                  <td>{storage.binNumber}</td>
                  <td>{storage.rackNumber}</td>
                  <td>{storage.skucode}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AccordionDetails>
      </Accordion>
            </div>
  );
}

export default Storage;