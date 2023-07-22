import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../Firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';
import DeviceSensors from './DeviceSensors.js';
import Select from 'react-select';


// Sample list of options
const typeOptions = [
  { value: 'Option 1', label: 'Option 1' },
  { value: 'Option 2', label: 'Option 2' },
  { value: 'Option 3', label: 'Option 3' },
  { value: 'Option 4', label: 'Option 4' },
  // Add more options as needed
];


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
    window.location.reload();
  };

  const addSituation = async (situationName, previousState, thresholdTime, certainity) => {
    const newSituation = { id: uuidv4(), name: situationName, previousState: previousState, thresholdTime: thresholdTime, certainity:certainity };
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
    window.location.reload();
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
    window.location.reload();
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
                      <Select
                        options={typeOptions}
                        ref={typeRef}
                        onChange={(selectedOption) => {
                          typeRef.current.value = selectedOption.value
                        }}
                        isClearable
                        isSearchable
                        placeholder="Select Type from our own list..."
                      />
                      <input type="text" ref={typeRef} className="form-control mt-2" />
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
                  applicationID = {studentId}
                  deviceID = {id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDevicePage;
