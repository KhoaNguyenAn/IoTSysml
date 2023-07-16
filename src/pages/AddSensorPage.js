import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../Firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';

function AddSensorPage() {
    return (
        <div>
            <h1> Add Sensor Page </h1>
        </div>
    )
}


export default AddSensorPage;
