import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../Firebase.js'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';
import DevicePopup from '../components/AddDevice.js';

function StudentEdit() {
    let { id } = useParams();
    const [students, setStudents] = useState([]);
    const [student, setStudent] = useState({});
    const [refresh, setRefresh] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const applicationCollectionRef = collection(db, "applications");
    const applicationDoc = doc(db, "applications", id);

    useEffect(() => {
        const getApplications = async () => {
            const data = await getDocs(applicationCollectionRef);
            const studentData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setStudents(studentData);
            setIsLoading(false);
        }
        getApplications();
    }, [])

    const handleInput = (e) => {
        e.persist();
        setStudent({ ...student, [e.target.name]: e.target.value });
    }

    const updateStudent = async (e) => {
        e.preventDefault();

        const data = {
            name: student.name,
            email: student.email,
            phone: student.phone,
            course: student.course,
            devices: student.devices // Include devices in the updated data
        }

        await updateDoc(applicationDoc, data);
    }

    const getDataFromId = () => {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                setStudent(students[i]);
                console.log(student)
            }
        }
    }

    const addDevice = async (deviceName, description) => {
        var device = {
            name: deviceName,
            id: uuidv4(),
        }

        for (let i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                if (students[i].devices === undefined) {
                    students[i].devices = [device];
                } else {
                    students[i].devices.push(device);
                }
                let data = students[i];
                await updateDoc(applicationDoc, data);
                setStudent(...students)
                setRefresh(!refresh)
            }
        }
    }

    const deleteDevice = async (deviceId) => {
        for (let i = 0; i < students.length; i++) {
          if (students[i].id === id) {
            if (students[i].devices) {
                for (let j = 0; j < students[i].devices.length; j++){
   
                    if (students[i].devices[j].id == deviceId ){
                        students[i].devices.splice(j, 1);

                        let data = students[i];
                        await updateDoc(applicationDoc, data);

                        setStudents([...students]); // Update the state with the modified students array
                        setRefresh(!refresh);
                        setStudent(students[i]);
                        return;
                        }
                }
        
            }
          }
        }
      };
      
      
      

    useEffect(() => {
        if (!isLoading) {
            getDataFromId();
        }
    }, [isLoading])

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
                                <h4> Edit Student
                                    <Link to="/students" className="btn btn-danger float-end">
                                        Back
                                    </Link>
                                </h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={updateStudent}>
                                    <div className="mb-3">
                                        <label>Name</label>
                                        <input type="text" name="name" value={student.name} onChange={handleInput} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Email</label>
                                        <input type="text" name="email" value={student.email} onChange={handleInput} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Phone</label>
                                        <input type="text" name="phone" value={student.phone} onChange={handleInput} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Course</label>
                                        <input type="text" name="course" value={student.course} onChange={handleInput} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-primary">Update Student</button>
                                    </div>
                                    <DevicePopup addDevice={addDevice} />
                                    <div>
                                        {console.log()}
                                        <h4>Devices</h4>
                                        <ul>
                                            {student.devices && student.devices.map((device) => (
                                                <li key={device.id}>
                                                    {device.name} - {device.description}
                                                    
                                                    <button type="button" onClick={() => deleteDevice(device.id)} className="btn btn-danger btn-sm">Delete</button>
                                                    {console.log(id)}
                                                    <Link to={`/device/${device.id}/edit?studentId=${id}`} className="btn btn-success">Edit</Link>

                                                </li>
                                            ))}
                                        </ul>
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

export default StudentEdit;
