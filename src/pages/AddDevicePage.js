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
  const typeRef = useRef(null);
  const deploymentLocationRef = useRef(null);
  const quantityKindRef = useRef(null);


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
              typeRef.current.value = students[i].devices[j].type;
              deploymentLocationRef.current.value = students[i].devices[j].deploymentLocation;
              quantityKindRef.current.value = students[i].devices[j].quantityKind;
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
              return { ...dev, name: nameRef.current.value, id: emailRef.current.value, 
                      description: descriptionRef.current.value, type: typeRef.current.value,
                      deploymentLocation: deploymentLocationRef.current.value, quantityKind: quantityKindRef.current.value
                      };
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

  const addSensor = async (sensorName, value, type, deploymentLocation, quantityKind) => {
    const newSensor = { id: uuidv4(), name: sensorName, value: value,
                        type: type, deploymentLocation: deploymentLocation,
                        quantityKind: quantityKind
                       };
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

  const addSituation = async (situationName, previousState, thresholdTime, certainty) => {
    const newSituation = { id: uuidv4(), name: situationName, previousState: previousState, thresholdTime: thresholdTime, certainty:certainty };
    const updatedStudents = students.map((student) => {
      if (student.id === studentId) {
        if (student.devices) {
          const updatedDevices = student.devices.map((dev) => {
            if (dev.id === id) {
              if (!dev.situations) {
                dev.situations = [newSituation];
              } else {
                dev.situations.push(newSituation);
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

  const deleteSituation = async (situationId) => {
    // console.log(studentId)
    // console.log(id)
    const updatedStudents = students.map((student) => {
      if (student.id === studentId) {
        if (student.devices) {
          const updatedDevices = student.devices.map((dev) => {
            if (dev.id === id) {
              if (dev.situations) {
                dev.situations = dev.situations.filter((situation) => situation.id !== situationId);
              }
            }
            return dev;
          });
          return { ...student, devices: updatedDevices };
        }
      }
      return student;
    });

    await updateDoc(applicationDoc, updatedStudents[0]);
    setStudents([...students]);
    setRefresh(!refresh)
  };


  const deleteSensor = async (sensorId) => {
    // console.log(studentId)
    // console.log(id)
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

    await updateDoc(applicationDoc, updatedStudents[0]);
    setStudents([...students]);
    setRefresh(!refresh)
  };

  useEffect(() => {
    if (!isLoading) {
      getDataFromId();
      for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {
          setStudentIndex(i)
        }
      }
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
                    <label>Type</label>
                    <input type="text" ref={typeRef} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label>Deployment Location</label>
                    <input type="text" ref={deploymentLocationRef} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label>Quantity Kind</label>
                    <input type="text" ref={quantityKindRef} className="form-control" />
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
                  situations={device.situations}
                  addSituation={addSituation}
                  deleteSituation={deleteSituation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceSensors({ sensors, addSensor, deleteSensor, situations, addSituation, deleteSituation }) {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [sensorName, setSensorName] = useState('');
  const [sensorValue, setSensorValue] = useState('');
  const [type, setType] = useState('');
  const [deploymentLocation, setdeploymentLocation] = useState('');
  const [quantityKind, setquantityKind] = useState('');

  const [situationName, setSituationName] = useState('');
  const [previousState, setPreviousState] = useState('');
  const [thresholdTime, setThresholdTime] = useState('');
  const [certainty, setCertainty] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);

  const handleSaveSensor = () => {
    addSensor(sensorName, sensorValue, type, deploymentLocation, quantityKind);
    setShow(false);
    setSensorName('');
    setSensorValue('');
    setType('');
    setdeploymentLocation('');
    setquantityKind('');
  };

  const handleSaveSituation = () => {
    addSituation(situationName,previousState, thresholdTime, certainty)
    setShow1(false);
    setSituationName('');
    setPreviousState('');
    setThresholdTime('');
    setCertainty('');
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
              <th>Type</th>
              <th>Deployment Location</th>
              <th>Quantity Kind</th>
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
                  <td> {sensor.type} </td>
                  <td> {sensor.deploymentLocation} </td>
                  <td> {sensor.quantityKind} </td>
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
      <div className="card-header">
        <h4> Situations List </h4>
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Previous State</th>
              <th>Threshold Time</th>
              <th>Certainity</th>
            </tr>
          </thead>
          <tbody>
            {/* Replace 'situations' with the actual array of situations */}
            {situations &&
              situations.map((situation) => (
                <tr key={situation.id}>
                  <td>{situation.id}</td>
                  <td>{situation.name}</td>
                  <td>{situation.previousState}</td>
                  <td>{situation.thresholdTime}</td>
                  <td>{situation.certainty}</td>
                  <td>
                    <Link to={`/situation/${situation.id}/edit`} className="btn btn-success">
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button type="button" onClick={() => deleteSituation(situation.id)} className="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <button type="button" onClick={handleShow1} className="btn btn-primary">
          Add Situation
        </button>
      </div>
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title> Add Situation </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal body content */}
          <div className="mb-3">
            <label>Situation Name</label>
            <input
              type="text"
              className="form-control"
              value={situationName}
              onChange={(e) => setSituationName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Previous State</label>
            <input
              type="text"
              className="form-control"
              value={previousState}
              onChange={(e) => setPreviousState(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Threshold Time</label>
            <input
              type="text"
              className="form-control"
              value={thresholdTime}
              onChange={(e) => setThresholdTime(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Certainty</label>
            <input
              type="text"
              className="form-control"
              value={certainty}
              onChange={(e) => setCertainty(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveSituation}>
            Save Situation
          </Button>
        </Modal.Footer>
      </Modal>

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
            <div className="mb-3">
              <label>Sensor Type</label>
              <input
                type="text"
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Deployment Location</label>
              <input
                type="text"
                className="form-control"
                value={deploymentLocation}
                onChange={(e) => setdeploymentLocation(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Quantity Kind</label>
              <input
                type="text"
                className="form-control"
                value={quantityKind}
                onChange={(e) => setquantityKind(e.target.value)}
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
