import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


function ViewMatrix() {
  const location = useLocation();
  const situations = location.state;
  console.log(situations)

  return (
    <TableContainer component={Paper}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align='center'>
            Situations Matrix
          </Typography>
        </Toolbar>
      </AppBar>

      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Situation Value</StyledTableCell>
            {situations.map((situation) => (
              <StyledTableCell align="center">{situation.name}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {situations.map((situation) => (
            <StyledTableRow key={situation.name}>
              <StyledTableCell component="th" scope="row">
                {situation.name}
              </StyledTableCell>
              {
                situations.map(() => (
                  <StyledTableCell align="center">
                    <TextField id={situation.name} label="value" variant="filled" />
                  </StyledTableCell>
                ))
              }
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
          <Button variant="contained">
              Update Situation Value Data
          </Button>
      </div>
    </TableContainer>
  );
}

export default ViewMatrix; 

// import React, { useState } from 'react';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';

// function MyForm() {
//   const initialFields = [
//     { label: 'Field 1', value: '' },
//     { label: 'Field 2', value: '' },
//     { label: 'Field 3', value: '' },
//     // Add more fields as needed
//   ];

//   const [fields, setFields] = useState(initialFields);

//   const handleFieldChange = (index) => (event) => {
//     const { value } = event.target;
//     setFields((prevFields) =>
//       prevFields.map((field, i) => (i === index ? { ...field, value } : field))
//     );
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Use the 'fields' array to access data from each text field
//     fields.forEach((field, index) => {
//       console.log(`${field.label}: ${field.value}`);
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {fields.map((field, index) => (
//         <TextField
//           key={index}
//           label={field.label}
//           value={field.value}
//           onChange={handleFieldChange(index)}
//           fullWidth
//           margin="normal"
//         />
//       ))}
//       <Button type="submit" variant="contained" color="primary">
//         Submit
//       </Button>
//     </form>
//   );
// }

// export default MyForm;

