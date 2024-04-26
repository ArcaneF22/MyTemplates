import React, { useState } from 'react';
import Papa from 'papaparse'; //INSTALL { npm i papaparse }
import axios from 'axios'; //INSTALL { npm i axios }

export const HelloWorld = () => {
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
  
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      if (!file || !file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file.');
        return;
      }
  
      setErrorMessage(null); // Clear any previous errors
  
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setImages([...images, base64Image]); // Add image to the array
      };
  
      reader.readAsDataURL(file); // Read image as base64 string
    };
    return (
        <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {errorMessage && <p className="error">{errorMessage}</p>}
        {images.length > 0 && (
          <ul>
            {images.map((image, index) => (
              <li key={index}>
                <img src={image} alt={`Uploaded Image ${index + 1}`} />
              </li>
            ))}
          </ul>
        )}
        {images}
      </div>
      );
}
