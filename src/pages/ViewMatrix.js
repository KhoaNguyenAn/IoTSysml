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

import { db } from '../Firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';



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
  var situationsList = location.state.situations;
  situationsList = situationsList.map((situation) => {
    return {
      ...situation,
      values: situation.values ?? new Array(situationsList.length).fill(0)
    };
  });

  // console.log(situations)
  const [situations, setSituations] = useState(situationsList)

  console.log(location.state.situations)
  // console.log(location.state.applicationID)
  // console.log(location.state.deviceID)



  const [isLoading, setIsLoading] = useState(true);
  const [device, setDevice] = useState({});
  const applicationCollectionRef = collection(db, 'applications');
  const applicationDoc = doc(db, 'applications', location.state.applicationID);


  const [studentIndex, setStudentIndex] = useState(null);
  const [students, setStudents] = useState([]);
  const [refresh, setRefresh] = useState(false)


  useEffect(() => {


    const getApplications = async () => {
      const data = await getDocs(applicationCollectionRef);
      const studentData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setStudents(studentData);
      setIsLoading(false);
    };
    getApplications()
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error('Error retrieving applications:', error);
        setIsLoading(false);
      });
  }, [students, refresh]);

  const getDataFromId = () => {
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === location.state.applicationID) {
        if (students[i].devices) {
          for (let j = 0; j < students[i].devices.length; j++) {
            if (students[i].devices[j].id === location.state.deviceID) {
              // console.log(students[i].devices[j])
              setDevice(students[i].devices[j]);
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      getDataFromId();
      for (let i = 0; i < students.length; i++) {
        if (students[i].id === location.state.applicationID) {
          setStudentIndex(i)
        }
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  
  const handleSituationChange = (index, index2) => (event) => {
    const { value } = event.target;
    setSituations((prevSituations) =>
      prevSituations.map((situation, i) =>
        i === index
          ? { ...situation, values: situation.values.map((val, j) => (j === index2 ? value : val)) }
          : situation
      )
    );
  };

  const handleSubmit = async() => {
      const updatedStudents = students.map((student) => {
        if (student.id === location.state.applicationID) {
          if (student.devices) {
            const updatedDevices = student.devices.map((dev) => {
              if (dev.id === location.state.deviceID) {
                dev.situations = situations
              }
              setDevice(dev)
              return dev;
            });
            return { ...student, devices: updatedDevices };
          }
        }
        return student;
      });
      await updateDoc(applicationDoc, updatedStudents[0]);
      // console.log(updatedStudents)
      setStudents(updatedStudents[0])
      setRefresh(!refresh)
  };

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
          {situations.map((situation, index) => (
            <StyledTableRow key={situation.name}>
              <StyledTableCell component="th" scope="row">
                {situation.name}
              </StyledTableCell>
              {
                
                situations.map((situation2, index2) => (
                  <StyledTableCell align="center">
                    <TextField label="value" variant="filled" key={`${index}-${index2}`} 
                               value={situation.values[index2] !== undefined ? situation.values[index2] : ''}
                               onChange={handleSituationChange(index, index2)}
                    />
                  </StyledTableCell>
                ))
              }
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
          <Button variant="contained" onClick={handleSubmit}>
              Update Situation Value Data
          </Button>
      </div>
    </TableContainer>
  );
}

export default ViewMatrix; 


