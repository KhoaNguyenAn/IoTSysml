import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function DevicePopup({ addDevice }) {
    const [show, setShow] = useState(false);
    const [deviceName, setDeviceName] = useState('');
    const [description, setDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSave = () => {
        addDevice(deviceName, description);
        setShow(false);
        setDeviceName('');
        setDescription('');
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
