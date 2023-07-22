import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../Firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Select from 'react-select';


// Sample list of options
const typeOptions = [
  { value: 'Option 1', label: 'Option 1' },
  { value: 'Option 2', label: 'Option 2' },
  { value: 'Option 3', label: 'Option 3' },
  { value: 'Option 4', label: 'Option 4' },
  // Add more options as needed
];


function EditSensorPage() {
  const location = useLocation();

  // console.log(location.state.applicationID)
  // console.log(location.state.deviceID)
  // console.log(location.state.sensorID)

  const nameRef = useRef(null);
  const idRef = useRef(null);
  const valueRef = useRef(null);
  const typeRef = useRef(null);
  const deploymentLocationRef = useRef(null);
  const quantityKindRef = useRef(null);


  const [isLoading, setIsLoading] = useState(true);
  const [device, setDevice] = useState({});
  const applicationCollectionRef = collection(db, 'applications');
  const applicationDoc = doc(db, 'applications', location.state.applicationID);


  const [studentIndex, setStudentIndex] = useState(null);
  const [students, setStudents] = useState([]);
  const [refresh, setRefresh] = useState(false)

  const [sensor, setSensor] = useState({});




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
              //   console.log(students[i].devices[j].sensors.length)
              for (let k = 0; k < students[i].devices[j].sensors.length; k++) {
                if (students[i].devices[j].sensors[k].id === location.state.sensorID) {
                  setSensor(students[i].devices[j].sensors[k])
                  console.log(students[i].devices[j].sensors[k])
                  nameRef.current.value = students[i].devices[j].sensors[k].name;
                  idRef.current.value = students[i].devices[j].sensors[k].id
                  valueRef.current.value = students[i].devices[j].sensors[k].value;
                  typeRef.current.value = students[i].devices[j].sensors[k].type;
                  deploymentLocationRef.current.value = students[i].devices[j].sensors[k].deploymentLocation;
                  quantityKindRef.current.value = students[i].devices[j].sensors[k].quantityKind;
                }
              }
            }
          }
        }
      }
    }
  };


  const saveSensor = async (e) => {
    e.preventDefault();

    const updatedStudents = students.map((student) => {
      if (student.id === location.state.applicationID) {
        if (student.devices) {
          const updatedDevices = student.devices.map((dev, index) => {
            if (dev.id === location.state.deviceID) {
              const updatedSensors = dev.sensors.map((sensor) => {
                if (sensor.id === location.state.sensorID) {
                  return {
                    ...sensor,
                    name: nameRef.current.value,
                    id: idRef.current.value,
                    value: valueRef.current.value,
                    type: typeRef.current.value,
                    deploymentLocation: deploymentLocationRef.current.value,
                    quantityKind: quantityKindRef.current.value,
                  };
                }
                return sensor;
              });
              return { ...dev, sensors: updatedSensors };
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


  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4> Edit Sensor
                  <Link to={`/device/${location.state.deviceID}/edit?studentId=${location.state.applicationID}`} className="btn btn-danger float-end">
                    Back
                  </Link>
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={saveSensor}>
                  <div className="mb-3">
                    <label>Name</label>
                    <input type="text" ref={nameRef} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label>Value</label>
                    <input type="text" ref={valueRef} className="form-control" />
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
                    <input
                      type="number"
                      className="form-control"
                      ref={quantityKindRef}
                      min={1}
                    />
                  </div>
                  <div className="mb-3">
                    <label>ID</label>
                    <input type="text" ref={idRef} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Update Sensor</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default EditSensorPage;
