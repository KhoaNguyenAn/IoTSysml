import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

function Student() {

    const [students, setStudents] = useState([]);

    useEffect( () => {

            // axios.get().then(res => {
                
            // });
            var students1 = [
                {
                    "id": 1,
                    "name": "khoa",
                    "course": "abc",
                    "email": "angu0093@student.monash",
                    "phone": "9132912391"
                },
                {
                    "id": 2,
                    "name": "khoa2",
                    "course": "abcd",
                    "email": "angu0023@student.monash",
                    "phone": "2222222"
                }
            ]
            setStudents(students1);

    },[])

    const deleteStudent = (e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting...";

        // Delete
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
                    <Link to={`/students/${item.id}/edit`} className="btn btn-success">Edit</Link>
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
                                    <h4> Students List
                                        <Link to="/students/create" className="btn btn-primary float-end">Add Student</Link>
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Course</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentDetails}
                                        </tbody>
                                    </table>
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