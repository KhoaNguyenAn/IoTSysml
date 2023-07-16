import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../Firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';

function AddDevicePage() {
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const applicationCollectionRef = collection(db, 'applications');
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const descriptionRef = useRef(null);
  const searchParams = new URLSearchParams(location.search);
  const studentId = searchParams.get('studentId');
  const [isLoading, setIsLoading] = useState(true);
  const [device, setDevice] = useState({});
  const [studentIndex, setStudentIndex] = useState(null);
  const [students, setStudents] = useState([]);
  const applicationDoc = doc(db, 'applications', studentId);
  const [refresh, setRefresh] = useState(false)


  // console.log(studentId);

  useEffect(() => {

    for (let i = 0; i < students.length; i++) {
      if (students[i].id === studentId) {
        setStudentIndex(i)
      }
    }



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
  }, []);

  const getDataFromId = () => {
    // console.log("hi")
    // console.log(students)
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === studentId) {
        if (students[i].devices) {
          for (let j = 0; j < students[i].devices.length; j++) {
            if (students[i].devices[j].id === id) {
              console.log(students[i].devices[j])
              setDevice(students[i].devices[j]);
              nameRef.current.value = students[i].devices[j].name;
              emailRef.current.value = students[i].devices[j].id;
              descriptionRef.current.value = students[i].devices[j].description;
            }
          }
        }
      }
    }
  };

  const saveDevice = async (e) => {
    e.preventDefault();

    const updatedStudents = students.map((student) => {
      if (student.id === studentId) {
        if (student.devices) {
          const updatedDevices = student.devices.map((dev) => {
            if (dev.id === id) {
              return { ...dev, name: nameRef.current.value, id: emailRef.current.value, description: descriptionRef.current.value };
            }
            return dev;
          });
          return { ...student, devices: updatedDevices };
        }
      }
      return student;
    });

    await updateDoc(applicationDoc, updatedStudents[studentIndex]);
  };

  const addSensor = async (sensorName, value) => {
    const newSensor = { id: uuidv4(), name: sensorName, value };
    const updatedStudents = students.map((student) => {
      if (student.id === studentId) {
        if (student.devices) {
          const updatedDevices = student.devices.map((dev) => {
            if (dev.id === id) {
              if (!dev.sensors) {
                dev.sensors = [newSensor];
              } else {
                dev.sensors.push(newSensor);
              }
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


  const deleteSensor = async (sensorId) => {
    const updatedStudents = students.map((student) => {
      if (student.id === studentId) {
        if (student.devices) {
          const updatedDevices = student.devices.map((dev) => {
            if (dev.id === id) {
              if (dev.sensors) {
                dev.sensors = dev.sensors.filter((sensor) => sensor.id !== sensorId);
              }
            }
            return dev;
          });
          return { ...student, devices: updatedDevices };
        }
      }
      return student;
    });

    await updateDoc(applicationDoc, updatedStudents[studentIndex]);
  };

  useEffect(() => {
    if (!isLoading) {
      getDataFromId();
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4>
                  Edit device
                  <Link to="/students" className="btn btn-danger float-end">
                    Back
                  </Link>
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={saveDevice}>
                  <div className="mb-3">
                    <label>Name</label>
                    <input type="text" ref={nameRef} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <input type="text" ref={descriptionRef} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label>ID</label>
                    <input type="text" ref={emailRef} className="form-control" />
                  </div>

                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary">
                      Save Device
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <DeviceSensors
                  sensors={device.sensors}
                  addSensor={addSensor}
                  deleteSensor={deleteSensor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceSensors({ sensors, addSensor, deleteSensor }) {
  const [show, setShow] = useState(false);
  const [sensorName, setSensorName] = useState('');
  const [sensorValue, setSensorValue] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSaveSensor = () => {
    addSensor(sensorName, sensorValue);
    setShow(false);
    setSensorName('');
    setSensorValue('');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4> Sensors List </h4>
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Value</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sensors &&
              sensors.map((sensor) => (
                <tr key = {sensor.id}>
                  <td> {sensor.id} </td>
                  <td> {sensor.name} </td>
                  <td> {sensor.value} </td>
                  <td>
                      <Link to={`/sensor/${sensor.id}/edit`} className="btn btn-success">Edit</Link>
                  </td>
                  <td>
                      <button type="button" onClick={() => deleteSensor(sensor.id)} className="btn btn-danger">
                           Delete
                      </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <button type="button" onClick={handleShow} className="btn btn-primary">
          Add Sensor
        </button>
      </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Sensor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Sensor Name</label>
              <input
                type="text"
                className="form-control"
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Sensor Value</label>
              <input
                type="text"
                className="form-control"
                value={sensorValue}
                onChange={(e) => setSensorValue(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveSensor}>
              Save Sensor
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
}

export default AddDevicePage;
