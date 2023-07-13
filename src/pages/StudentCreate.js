import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import {db} from '../Firebase.js'
import {collection, addDoc} from 'firebase/firestore'

function StudentCreate() {

    const navigate = useNavigate()
    const applicationCollectionRef = collection(db, "applications")

    const [student, setStudent] = useState({
        name: '',
        email:'',
        phone:'',
        course:''
    })

    const handleInput = (e) => {
        e.persist();
        setStudent({...student, [e.target.name]: e.target.value});
    }

    const saveStudent = async(e) => {
        e.preventDefault();

        // const data = {
        //     name: student.name,
        //     email: student.email,
        //     phone: student.phone,
        //     course: student.course,
        // }

        await addDoc(applicationCollectionRef, {title: "abc", description: "ddd"});

        // save
        navigate('/students')
        
    }

    return (
        <div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4> Add Student
                                    <Link to="/students" className="btn btn-danger float-end">
                                        Back
                                    </Link>
                                </h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={saveStudent}>
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
                                        <button type="submit" className="btn btn-primary">Save Student</button>
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

export default StudentCreate;