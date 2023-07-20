import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../Firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import ViewMatrix from './ViewMatrix.js';

function DeviceSensors({ sensors, addSensor, deleteSensor, situations, addSituation, deleteSituation }) {
    const navigate = useNavigate();

    const handleViewMatrix = () => {
        navigate('/situation/matrix',{state: situations})
      };

    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [sensorName, setSensorName] = useState('');
    const [sensorValue, setSensorValue] = useState('');
    const [type, setType] = useState('');
    const [deploymentLocation, setdeploymentLocation] = useState('');
    const [quantityKind, setquantityKind] = useState('');
  
    const [situationName, setSituationName] = useState('');
    const [previousState, setPreviousState] = useState('');
    const [thresholdTime, setThresholdTime] = useState('');
    const [certainty, setCertainty] = useState('');
  
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
  
    const handleShow1 = () => setShow1(true);
    const handleClose1 = () => setShow1(false);
  
    const handleSaveSensor = () => {
      addSensor(sensorName, sensorValue, type, deploymentLocation, quantityKind);
      setShow(false);
      setSensorName('');
      setSensorValue('');
      setType('');
      setdeploymentLocation('');
      setquantityKind('');
    };
  
    const handleSaveSituation = () => {
      addSituation(situationName,previousState, thresholdTime, certainty)
      setShow1(false);
      setSituationName('');
      setPreviousState('');
      setThresholdTime('');
      setCertainty('');
    };
  
    return (
      <div className="card">
        <div className="card-header">
          <h4> Sensors List </h4>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Value</th>
                <th>Type</th>
                <th>Deployment Location</th>
                <th>Quantity Kind</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {sensors &&
                sensors.map((sensor) => (
                  <tr key = {sensor.id}>
                    <td> {sensor.id} </td>
                    <td> {sensor.name} </td>
                    <td> {sensor.value} </td>
                    <td> {sensor.type} </td>
                    <td> {sensor.deploymentLocation} </td>
                    <td> {sensor.quantityKind} </td>
                    <td>
                        <Link to={`/sensor/${sensor.id}/edit`} className="btn btn-success">Edit</Link>
                    </td>
                    <td>
                        <button type="button" onClick={() => deleteSensor(sensor.id)} className="btn btn-danger">
                             Delete
                        </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button type="button" onClick={handleShow} className="btn btn-primary">
            Add Sensor
          </button>
        </div>
        <div className="card-header">
          <h4> Situations List </h4>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Previous State</th>
                <th>Threshold Time</th>
                <th>Certainity</th>
              </tr>
            </thead>
            <tbody>
              {/* Replace 'situations' with the actual array of situations */}
              {situations &&
                situations.map((situation) => (
                  <tr key={situation.id}>
                    <td>{situation.id}</td>
                    <td>{situation.name}</td>
                    <td>{situation.previousState}</td>
                    <td>{situation.thresholdTime}</td>
                    <td>{situation.certainty}</td>
                    <td>
                      <Link to={`/situation/${situation.id}/edit`} className="btn btn-success">
                        Edit
                      </Link>
                    </td>
                    <td>
                      <button type="button" onClick={() => deleteSituation(situation.id)} className="btn btn-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button type="button" onClick={handleShow1} className="btn btn-primary">
            Add Situation
          </button>
          <button type="button" onClick={handleViewMatrix} className="btn btn-dark float-end">
            View Matrix
          </button>


        </div>
        <Modal show={show1} onHide={handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title> Add Situation </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Modal body content */}
            <div className="mb-3">
              <label>Situation Name</label>
              <input
                type="text"
                className="form-control"
                value={situationName}
                onChange={(e) => setSituationName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Previous State</label>
              <input
                type="text"
                className="form-control"
                value={previousState}
                onChange={(e) => setPreviousState(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Threshold Time</label>
              <input
                type="text"
                className="form-control"
                value={thresholdTime}
                onChange={(e) => setThresholdTime(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Certainty</label>
              <input
                type="text"
                className="form-control"
                value={certainty}
                onChange={(e) => setCertainty(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose1}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveSituation}>
              Save Situation
            </Button>
          </Modal.Footer>
        </Modal>
  
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Sensor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label>Sensor Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={sensorName}
                  onChange={(e) => setSensorName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Sensor Value</label>
                <input
                  type="text"
                  className="form-control"
                  value={sensorValue}
                  onChange={(e) => setSensorValue(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Sensor Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Deployment Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={deploymentLocation}
                  onChange={(e) => setdeploymentLocation(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Quantity Kind</label>
                <input
                  type="text"
                  className="form-control"
                  value={quantityKind}
                  onChange={(e) => setquantityKind(e.target.value)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveSensor}>
                Save Sensor
              </Button>
            </Modal.Footer>
          </Modal>
  
          
        </div>
    );
  }

export default DeviceSensors;