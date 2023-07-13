import React, {useEffect, useState} from 'react'
import { Link, useParams} from 'react-router-dom'
import {db} from '../Firebase.js'
import {collection, updateDoc, doc} from 'firebase/firestore'

function StudentEdit() {

    let {id} = useParams();


    const [student, setStudent] = useState([]);

    useEffect(() => {
        var students1 = 
            {
                "id": 3,
                "name": "khoa1",
                "course": "abcd",
                "email": "angu0093@student.monash",
                "phone": "9132912391"
            }
        setStudent(students1);
    },[id])

    const handleInput = (e) => {
        e.persist();
        setStudent({...student, [e.target.name]: e.target.value});
    }

    const updateStudent = async(e) => {
        e.preventDefault();

        const data = {
            name: student.name,
            email: student.email,
            phone: student.phone,
            course: student.course,
        }

        // save
        const applicationDoc = doc(db, "applications", id)
        await updateDoc(applicationDoc, data);
        
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
                                        <input type="text" name="name" value={student.name} onchange={handleInput} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Email</label>
                                        <input type="text" name="email" value={student.email} onchange={handleInput} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Phone</label>
                                        <input type="text" name="phone" value={student.phone} onchange={handleInput} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Course</label>
                                        <input type="text" name="course" value={student.course} onchange={handleInput} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-primary">Update Student</button>
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