import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../Firebase.js'
import { collection, addDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';

function StudentCreate() {
    const navigate = useNavigate();
    const applicationCollectionRef = collection(db, "applications");
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const courseRef = useRef(null);

    const saveStudent = () => {

        const id = uuidv4();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const phone = phoneRef.current.value;
        const course = courseRef.current.value;
        const device = [];
        console.log( {id, name, email, phone, course })

        const newUser = {
            id: id, // Generate a unique ID
            name: name,
            email: email,
            phone: phone,
            course: course
          };

        addDoc(applicationCollectionRef,  newUser);
        
        navigate('/students');
    }

    return (
        <div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4> Add Application
                                    <Link to="/students" className="btn btn-danger float-end">
                                        Back
                                    </Link>
                                </h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={saveStudent}>
                                    <div className="mb-3">
                                        <label>Application Name</label>
                                        <input type="text" ref={nameRef} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Purpose</label>
                                        <input type="text" ref={emailRef} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Type</label>
                                        <input type="text" ref={phoneRef} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Description</label>
                                        <input type="text" ref={courseRef} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-primary">Save Application</button>
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
