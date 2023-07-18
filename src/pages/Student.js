import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {db} from '../Firebase.js'
import {collection, getDocs, doc, deleteDoc} from 'firebase/firestore'

function Student() {

    const [students, setStudents] = useState([]);

    const applicationCollectionRef = collection(db, "applications")
    useEffect( () => {


            const getApplications = async() => {
                const data = await getDocs(applicationCollectionRef);
                console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
                setStudents(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
            }

            getApplications()



    },[])

    const deleteStudent = async(e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting...";

        // Delete
        const applicationDoc = doc(db, "applications", id);
        await deleteDoc(applicationDoc);

        // thisClicked.closest("tr").remove();

    }

    var studentDetails = "";
    studentDetails = students.map( (item, index) => {
        return (
            <tr key = {index}>
                <td> {item.id} </td>
                <td> {item.name} </td>
                <td> {item.course} </td>
                <td> {item.email} </td>
                <td> {item.phone} </td>
                <td>
                    <Link to={`/students/${students[index].id}/edit`} className="btn btn-success">Edit</Link>
                </td>
                <td>
                    <button type="button" onClick={(e) => deleteStudent(e, item.id)} className="btn btn-danger">Delete</button>
                </td>
            </tr>
        )
    });
    return (
        <div className="container mt-5">
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4> Applications List
                                        <Link to="/students/create" className="btn btn-primary float-end">Add Application</Link>
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Application Name</th>
                                                <th>Purpose</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentDetails}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer d-flex justify-content-center">
                                    <button className="btn btn-warning float-end">Export All Data To JSON</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Student;