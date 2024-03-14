import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Item.css';
import Header from './Header';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios'; 
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function Bom() {
  const [validated, setValidated] = useState(false);
  const [skucode, setSku] = useState("");
  const [bomItem, setBomItem] = useState("");
  const [qty, setQty] = useState("");
  const [apiData, setApiData] = useState([]); 
  const [rowSelected, setRowSelected] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [skuList, setSkuList] = useState([]);
  const [skuSearchTerm, setSkuSearchTerm] = useState("");
const [bomItemSearchTerm, setBomItemSearchTerm] = useState("");
const [qtySearchTerm, setQtySearchTerm] = useState("");


  useEffect(() => {
    axios.get('http://localhost:8080/items') // Fetch SKU codes and descriptions from the items table
      .then(response => {
        // Extract SKU codes and descriptions from the response data and filter out null or undefined values
        const skuData = response.data
          .filter(item => item.skucode && item.description) // Filter out items where skucode or description is null or undefined
          .map(item => ({ skucode: item.skucode, description: item.description }));
        // Set the SKU data list state
        setSkuList(skuData);
      })
      .catch(error => console.error(error));
  }, []);
  
  

  const handleSubmit = (event) => {
    console.log("qty = ", qty);
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const formData = {
        skucode, 
        bomItem,
        qty,
      };

      axios.post('http://localhost:8080/boms' , formData)
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
        skucode,
        bomItem,
        qty
      };
      console.log('form data: ', formData)
      console.log("id: ", selectedItem.bomId)
  
      axios.put(`http://localhost:8080/boms/${selectedItem.bomId}`, formData)
        .then(response => {
          
          console.log('PUT request successful:', response);
          setValidated(false);
          setRowSelected(false);
          setSku("");
          setBomItem("");
          setQty("");
        })
        .catch(error => {
          console.error('Error sending PUT request:', error);
        });
    }
  };
  
  const handleRowClick = (bom) => {
    setSku(bom.skucode);
    setBomItem(bom.bomItem);
    setQty(bom.qty);
    setRowSelected(true);
    setSelectedItem(bom);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase
  };
  
  useEffect(() => {
    axios.get('http://localhost:8080/boms') 
      .then(response => setApiData(response.data))
      .catch(error => console.error(error));
    
  }, []);

  const handleSkuSearchChange = (event) => {
    setSkuSearchTerm(event.target.value.toLowerCase());
  };
  
  const handleBomItemSearchChange = (event) => {
    setBomItemSearchTerm(event.target.value.toLowerCase());
  };
  
  const handleQtySearchChange = (event) => {
    setQtySearchTerm(event.target.value.toLowerCase());
  };
  

  return (
    <div>
      <div className='title'>
        <h1>BOM</h1>
      </div>

      
      <Accordion defaultExpanded>
        <AccordionSummary className='acc-summary'
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{ backgroundColor: '#E5E7E9' }} 
        >
          <h4>BOM Form</h4>
        </AccordionSummary>
        <AccordionDetails>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>BOM item</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="BOM item"
                  name="bomItem"
                  value={bomItem}
                  onChange={(e) => setBomItem(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom03">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Quantity"
                  name="quantity"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>SKU Code</Form.Label>
                <Autocomplete
                  className="custom-autocomplete" 
                  disablePortal
                  id="combo-box-demo"
                  options={skuList}
                  getOptionLabel={(option) => option.skucode ? `${option.skucode} - ${option.description}` : ""}
                  value={skuList.find(option => option.skucode === skucode) || null}
                  onChange={(event, value) => setSku(value ? value.skucode : "")}
                  renderInput={(params) => <TextField {...params} label="SKU Code" />}
                  isOptionEqualToValue={(option, value) => option.skucode === value.skucode} // Customize the equality test
                
                />
              </Form.Group>
            </Row>
            {rowSelected ? (
              <Button onClick={handleRowSubmit}>Edit</Button>
            ) : (
              <Button type="submit" onClick={handleSubmit}>Submit</Button>
            )}
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
                <th>SKU
                <Form >
              <Form.Group className="mb-3" controlId="formSearch">
                <Form.Label>Search from Table</Form.Label>
                <Form.Control type="text" placeholder="Enter search text" onChange={handleSkuSearchChange} />
              </Form.Group>
            </Form>
                </th>
                <th>BOM Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
  {apiData.filter(bom =>
    (bom.skucode.toLowerCase().includes(skuSearchTerm) || !skuSearchTerm) &&
    (bom.bomItem.toLowerCase().includes(bomItemSearchTerm) || !bomItemSearchTerm) &&
    (bom.qty.toString().toLowerCase().includes(qtySearchTerm) || !qtySearchTerm)
  ).map(bom => (
    <tr key={bom.id} onClick={() => handleRowClick(bom)}>
      <td>{bom.skucode}</td>
      <td>{bom.bomItem}</td>
      <td>{bom.qty}</td>
    </tr>
  ))}
</tbody>

          </Table>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Bom;
