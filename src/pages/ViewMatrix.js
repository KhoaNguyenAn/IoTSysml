import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ViewMatrix() {
  const location = useLocation();
  const situations = location.state.length;

  // Function to render the UI matrix
  const renderMatrix = () => {
    const matrix = [];

    for (let i = 0; i < situations; i++) {
      const row = [];
      for (let j = 0; j < situations; j++) {
        // You can add additional content or styling to the cells here if needed
        row.push(
          <div key={`${i}-${j}`} className="matrix-cell border p-2">
            {i}-{j}
          </div>
        );
      }
      matrix.push(
        <div key={i} className="matrix-row d-flex">
          {row}
        </div>
      );
    }

    return matrix;
  };
  const handleGoBack = () => {
    this.props.navigation.goBack();
  };

  return (
    <div>
      <h1>Matrix</h1>
      <div className="matrix-container">{renderMatrix()}</div>
      <button type="button" onClick={handleGoBack} className="btn btn-secondary mt-3">
        Back
      </button>
    </div>
  );
}

export default ViewMatrix;
