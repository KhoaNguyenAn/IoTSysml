import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../Firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import ViewMatrix from './ViewMatrix.js';
import Select from 'react-select';

// Sample list of options
const typeOptions = [
  { value: 'Option 1', label: 'Option 1' },
  { value: 'Option 2', label: 'Option 2' },
  { value: 'Option 3', label: 'Option 3' },
  { value: 'Option 4', label: 'Option 4' },
  // Add more options as needed
];

function DeviceSensors({ sensors, addSensor, deleteSensor, situations, addSituation, deleteSituation, applicationID, deviceID }) {
  const navigate = useNavigate();

  const handleViewMatrix = () => {
    navigate('/situation/matrix', { state: { situations, applicationID, deviceID } })
  };

  const handleEditSensor = (sensorID) => {
    navigate('/sensor/edit', { state: { sensorID, applicationID, deviceID } })
  };

  const handleEditSituation = (situationID) => {
    navigate('/situation/edit', { state: { situationID, applicationID, deviceID } })
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
  const [certainity, setcertainity] = useState('');

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
    addSituation(situationName, previousState, thresholdTime, certainity)
    setShow1(false);
    setSituationName('');
    setPreviousState('');
    setThresholdTime('');
    setcertainity('');
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
                <tr key={sensor.id}>
                  <td> {sensor.id} </td>
                  <td> {sensor.name} </td>
                  <td> {sensor.value} </td>
                  <td> {sensor.type} </td>
                  <td> {sensor.deploymentLocation} </td>
                  <td> {sensor.quantityKind} </td>
                  <td>
                    <button type="button" onClick={() => handleEditSensor(sensor.id)} className="btn btn-success">
                      Edit
                    </button>
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
                  <td>{situation.certainity}</td>
                  <td>
                    <button type="button" onClick={() => handleEditSituation(situation.id)} className="btn btn-success">
                      Edit
                    </button>
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
            <label>certainity</label>
            <input
              type="text"
              className="form-control"
              value={certainity}
              onChange={(e) => setcertainity(e.target.value)}
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
            <label>Sensor Type</label>
            <Select
              options={typeOptions}
              onChange={(selectedOption) => {
                setType(selectedOption.value)
              }}
              isClearable
              isSearchable
              placeholder="Select Type from our own list..."
            />
            <textarea
              className="form-control mt-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Enter your own Type"
            ></textarea>
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
              type="number"
              className="form-control"
              value={quantityKind}
              onChange={(e) => setquantityKind(Math.max(1, e.target.value))}
              min={1}
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