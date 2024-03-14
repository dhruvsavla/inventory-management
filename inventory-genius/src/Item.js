import {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Item.css"
import { Table, FormControl} from 'react-bootstrap';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as XLSX from 'xlsx';

function Item() {
  const [validated, setValidated] = useState(false);
  const [Supplier, setSupplier] = useState("");
  const [skucode, setSKUCode] = useState("");
  const [description, setDescription] = useState("");
  const [packOf, setPackof] = useState("");
  const [parentSKU, setParentSKU] = useState("");
  const [group1, setGroup1] = useState("");
  const [group2, setGroup2] = useState("");
  const [group3, setGroup3] = useState("");
  const [sizeRange, setSizeRange] = useState("");
  const [size, setSize] = useState("");
  const [unit, setUnit] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [mrp, setMRP] = useState("");
  const [sellerSKUCode, setSellerSKUcode] = useState("");
  const [apiData, setApiData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState(""); 
  const [formData, setFormData] = useState({});
  const [parentSKUs, setParentSKUs] = useState([]);
  const [rowSelected, setRowSelected] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const formData = {
        supplierId,
        skucode,
        description,
        packOf,
        parentSKU,
        group1,
        group2,
        group3,
        sizeRange,
        size,
        unit,
        barcode,
        sellingPrice,
        mrp,
        sellerSKUCode
      };

      axios.post('http://localhost:8080/items/' + supplierId, formData)
        .then(response => {
          console.log('POST request successful:', response);
          setValidated(false);
          setApiData([...apiData, response.data]); // Add the newly created/updated item to the apiData array          
        })
        .catch(error => {
          console.error('Error sending POST request:', error);
        });
    }
  
    setValidated(true);
  };

  useEffect(() => {
    // Fetch initial data
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:8080/supplier')
      .then(response => {
        setSuppliers(response.data); 
      })
      .catch(error => {
        console.error('Error fetching supplier data:', error);
      });

      axios.get('http://localhost:8080/items')
      .then(response => {
        const filteredData = response.data.filter(item => typeof item === 'object');
        setApiData(filteredData); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleSupplierChange = (event, value) => {
    if (value) {
      console.log("Selected Supplier:", value);
      setSupplier(value); // Update the selected supplier object
      const selectedSupplier = value.supplierName;
      const supplierObj = suppliers.find(supplier => supplier.supplierName === selectedSupplier);
      if (supplierObj) {
        setSupplierId(supplierObj.supplierId);
      } else {
        setSupplierId(""); // Handle the case when supplierObj is not found
      }
    } else {
      setSupplier(null); // Clear the selected supplier if no value is selected
      setSupplierId(""); // Clear the supplierId as well
    }
  };
  

  const handleSKUCodeChange = (event, value1) => {
    if (value1) {
      console.log("Selected Parent SKU:", value1);
      setParentSKU(value1); // Update the selected SKU object
    } else {
      setParentSKU(null); // Clear the selected parent SKU if no value is selected
    }
  };
  
  const uniqueSKUCodes = [...new Set(apiData.filter(item => item.skucode !== null).map(item => item.skucode))];
  const initialParentSKU = parentSKU && uniqueSKUCodes.includes(parentSKU) ? parentSKU : null;

  useEffect(() => {
    console.log("apidata = " , apiData); // Print apiData whenever it changes
  }, [apiData]);

  const handleRowClick = (item) => {
    setSupplier(item.supplier);
    setSKUCode(item.skucode);
    setDescription(item.description);
    setPackof(item.packOf);
    setParentSKU(item.parentSKU);
    setGroup1(item.group1);
    setGroup2(item.group2);
    setGroup3(item.group3);
    setSizeRange(item.sizeRange);
    setSize(item.size);
    setUnit(item.unit);
    setBarcode(item.barcode);
    setSellingPrice(item.sellingPrice);
    setMRP(item.mrp);
    setSellerSKUcode(item.sellerSKUCode);

    setRowSelected(true);
  };

  const handleRowSubmit = () => {
    if (selectedItem) {
      const { itemId } = selectedItem; // Extract itemId from the selectedItem
      const updatedItem = {
        // Prepare the updated item object with the changes
        ...selectedItem,
        supplierId,
        skucode,
        description,
        packOf,
        parentSKU,
        group1,
        group2,
        group3,
        sizeRange,
        size,
        unit,
        barcode,
        sellingPrice,
        mrp,
        sellerSKUCode
      };

      // Send a PUT request to update the item
      axios.put(`http://localhost:8080/items/${itemId}`, updatedItem)
        .then(response => {
          console.log('PUT request successful:', response);
          // Reset the form and other state variables after successful update
          setValidated(false);
          setSelectedItem(null);
          // Reset other state variables as needed...
        })
        .catch(error => {
          console.error('Error sending PUT request:', error);
        });
    }
  };
  
  const handleSearchChange = (event) => {
      setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase
  };

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
              supplierId: supplierId,
              skucode: skucode,
              description: description,
              packOf: packOf,
              parentSKU: parentSKU,
              group1: group1,
              group2: group2,
              group3: group3,
              sizeRange: sizeRange,
              size: size,
              unit: unit,
              barcode: barcode,
              sellingPrice: sellingPrice,
              mrp: mrp,
              sellerSKUCode: sellerSKUCode
            };
          console.log(formattedData)
            postData(formattedData);
        });
    };

    reader.readAsBinaryString(file);
  };

  const postData = (data) => {
    axios.post('http://localhost:8080/items/' + supplierId, data)
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
            <h1>Item</h1>
        </div>

        <Accordion defaultExpanded>
          <AccordionSummary className='acc-summary'
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
              sx={{ backgroundColor: '#E5E7E9' }} 
            >
          <h4>Item Form</h4>
          </AccordionSummary>
        <AccordionDetails>
                
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">      
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Supplier</Form.Label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={suppliers.filter(option => option.supplierName)}
                  getOptionLabel={(option) => option ? option.supplierName : ""}
                  // value={Supplier}
                  onChange={(event, value) => handleSupplierChange(event, value)}
                  renderInput={(params) => <TextField {...params} label="Supplier" />}
                  isOptionEqualToValue={(option, value) => option.supplierId === value.supplierId} // Customize the equality test
                />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>


          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>SKUCode</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="SKUCode"
              defaultValue=""
              value={skucode }
              onChange={(e) => setSKUCode(e.target.value)}                  
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
                  
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Description</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Description"
                defaultValue=""
                value={description }
                onChange={(e) => setDescription(e.target.value)} 
              />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
              
        <Row className="mb-3">
         <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Packof</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Packof"
              defaultValue=""
              value={ packOf}
              onChange={(e) => setPackof(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
                
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>ParentSKU</Form.Label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={uniqueSKUCodes}
              getOptionLabel={(option) => option}
              // value={initialParentSKU} // Use initialParentSKU as the initial value
              onChange={(event, value1) => handleSKUCodeChange(event, value1)}
              renderInput={(params) => <TextField {...params} label="SKU Code" />}
              isOptionEqualToValue={(option, value) => option === value} // Customize the equality test
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
                
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Group1</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Group1"
              defaultValue=""
              value={ group1}
              onChange={(e) => setGroup1(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
            
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Group2</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Group2"
              defaultValue=""
              value={group2 }
              onChange={(e) => setGroup2(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
                
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Group3</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Group3"
              defaultValue=""
              value={ group3}
              onChange={(e) => setGroup3(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
                
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>SizeRange</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="SizeRange"
              defaultValue=""
              value={ sizeRange}
              onChange={(e) => setSizeRange(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
              
      <Row className="mb-3"> 
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Size</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Size"
              defaultValue=""
              value={size }
              onChange={(e) => setSize(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
                
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Unit</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Unit"
              defaultValue=""
              value={unit }
              onChange={(e) => setUnit(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
                
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Seller/Supplier SKUcode</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Seller/Supplier SKUcode"
              defaultValue=""
              value={sellerSKUCode }
              onChange={(e) => setSellerSKUcode(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
                
      </Row>
                   
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Barcode</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Barcode"
              defaultValue=""
              value={ barcode}
              onChange={(e) => setBarcode(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>SellingPrice</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="SellingPrice"
              defaultValue=""
              value={sellingPrice }
              onChange={(e) => setSellingPrice(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
                
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>MRP</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="MRP"
              defaultValue=""
              value={ mrp}
              onChange={(e) => setMRP(e.target.value)} 
            />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
                  
      {rowSelected ? (
        <Button onClick={handleRowSubmit}>Edit</Button>
      ) : (
        <Button type="submit">Submit</Button>
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
        <h4>List View of Item</h4>
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
        {apiData && (
  
      <table className='custom-table'>
        <thead>
          <tr>
            <th>Description</th>
            <th>Pack Of</th>
            <th>Parent SKU</th>
            <th>Group 1</th>
            <th>Group 2</th>
            <th>Group 3</th>
            <th>Size Range</th>
            <th>Size</th>
            <th>Unit</th>
            <th>Barcode</th>
            <th>Selling Price</th>
            <th>MRP</th>
            <th>Seller SKU Code</th>
            <th>SKU Code</th>
          </tr>
        </thead>
        <tbody>
          {apiData.map(item => (
            <tr key={item.itemId} onClick={() => handleRowClick(item)}> 
              <td>{item.description}</td>
              <td>{item.packOf}</td>
              <td>{item.parentSKU}</td>
              <td>{item.group1}</td>
              <td>{item.group2}</td>
              <td>{item.group3}</td>
              <td>{item.sizeRange}</td>
              <td>{item.size}</td>
              <td>{item.unit}</td>
              <td>{item.barcode}</td>
              <td>{item.sellingPrice}</td>
              <td>{item.mrp}</td>
              <td>{item.sellerSKUCode}</td>
              <td>{item.skucode}</td>
            </tr>
          ))}
        </tbody>
      </table>

      )}
          </AccordionDetails>
          </Accordion>

            </div>
          
  );
}

export default Item;