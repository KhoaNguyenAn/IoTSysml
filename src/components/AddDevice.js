import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';

// Sample list of options
const typeOptions = [
    { value: 'Option 1', label: 'Option 1' },
    { value: 'Option 2', label: 'Option 2' },
    { value: 'Option 3', label: 'Option 3' },
    { value: 'Option 4', label: 'Option 4' },
    // Add more options as needed
  ];

function DevicePopup({ addDevice }) {
    const [show, setShow] = useState(false);
    const [deviceName, setDeviceName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [deploymentLoc, setDeploymentLocation] = useState('');
    const [quantityKind, setQuantityKind] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSave = () => {
        addDevice(deviceName, description, type, deploymentLoc, quantityKind);
        setShow(false);
        setDeviceName('');
        setDescription('');
        setType('');
        setDeploymentLocation('');
        setQuantityKind('');
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Device
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label>Device Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label>Type</label>
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
                        <label>Deployment Location</label>
                        <textarea
                            className="form-control"
                            value={deploymentLoc}
                            onChange={(e) => setDeploymentLocation(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label>Quantity Kind</label>
                        <textarea
                            className="form-control"
                            value={quantityKind}
                            onChange={(e) => setQuantityKind(e.target.value)}
                        ></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DevicePopup;
