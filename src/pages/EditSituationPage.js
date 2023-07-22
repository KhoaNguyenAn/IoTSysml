import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../Firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';



function EditSituationPage() {
    const location = useLocation();

    // console.log(location.state.applicationID)
    // console.log(location.state.deviceID)
    // console.log(location.state.situationID)

    const nameRef = useRef(null);
    const idRef = useRef(null);
    const previousStateRef = useRef(null);
    const thresholdTimeRef = useRef(null);
    const certainityRef = useRef(null);


    const [isLoading, setIsLoading] = useState(true);
    const [device, setDevice] = useState({});
    const applicationCollectionRef = collection(db, 'applications');
    const applicationDoc = doc(db, 'applications', location.state.applicationID);
  
  
    const [studentIndex, setStudentIndex] = useState(null);
    const [students, setStudents] = useState([]);
    const [refresh, setRefresh] = useState(false)

    const [situation, setSituation] = useState({});




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
                //   console.log(students[i].devices[j].situations.length)
                  for (let k = 0; k < students[i].devices[j].situations.length; k++) {
                    if (students[i].devices[j].situations[k].id === location.state.situationID) {
                        setSituation(students[i].devices[j].situations[k])
                        // console.log(students[i].devices[j].situations[k])
                        nameRef.current.value = students[i].devices[j].situations[k].name;
                        idRef.current.value = students[i].devices[j].situations[k].id
                        previousStateRef.current.value = students[i].devices[j].situations[k].previousState;
                        thresholdTimeRef.current.value = students[i].devices[j].situations[k].thresholdTime;
                        certainityRef.current.value = students[i].devices[j].situations[k].certainity;
                    }
                  }
                }
              }
            }
          }
        }
      };


      const saveSituation = async (e) => {
        e.preventDefault();
      
        const updatedStudents = students.map((student) => {
          if (student.id === location.state.applicationID) {
            if (student.devices) {
              const updatedDevices = student.devices.map((dev, index) => {
                if (dev.id === location.state.deviceID) {
                  const updatedsituations = dev.situations.map((situation) => {
                    if (situation.id === location.state.situationID) {
                      return {
                        ...situation,
                        name: nameRef.current.value,
                        id: idRef.current.value,
                        previousState: previousStateRef.current.value,
                        thresholdTime: thresholdTimeRef.current.value,
                        certainity: certainityRef.current.value,
                      };
                    }
                    return situation;
                  });
                  return { ...dev, situations: updatedsituations };
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
                                <h4> Edit Situation
                                    <Link to={`/device/${location.state.deviceID}/edit?studentId=${location.state.applicationID}`} className="btn btn-danger float-end">
                                        Back
                                    </Link>
                                </h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={saveSituation}>
                                    <div className="mb-3">
                                        <label>ID</label>
                                        <input type="text" ref={idRef} className="form-control" readOnly />
                                    </div>
                                    <div className="mb-3">
                                        <label>Name</label>
                                        <input type="text" ref={nameRef} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Previous State</label>
                                        <input type="text" ref={previousStateRef} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Threshold Time</label>
                                        <input type="text" ref={thresholdTimeRef} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Certainity</label>
                                        <input type="text" ref={certainityRef} className="form-control" />
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


export default EditSituationPage;
