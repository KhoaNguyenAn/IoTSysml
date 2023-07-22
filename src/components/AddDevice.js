import React, { useState, useCallback } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
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

    const handleAddressChange = useCallback((address) => {
        setDeploymentLocation(address);
    }, []);

    const handleSelectAddress = useCallback((address) => {
        setDeploymentLocation(address);
        geocodeByAddress(address)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                // Do something with latLng (optional)
                console.log('Latlng:', latLng);
            })
            .catch((error) => console.error('Error', error));
    }, []);


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
                        <PlacesAutocomplete
                            value={deploymentLoc}
                            onChange={handleAddressChange}
                            onSelect={handleSelectAddress}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <>
                                    <input
                                        {...getInputProps({
                                            placeholder: 'Enter address...',
                                            className: 'form-control',
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </PlacesAutocomplete>
                    </div>
                    <div className="mb-3">
                        <label>Quantity Kind</label>
                        <input
                            type="number"
                            className="form-control"
                            value={quantityKind}
                            onChange={(e) => setQuantityKind(Math.max(1, e.target.value))}
                            min={1}
                        />
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
