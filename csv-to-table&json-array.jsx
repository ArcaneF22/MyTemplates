import React, { useState } from 'react';
import Papa from 'papaparse'; //INSTALL { npm i papaparse }
import axios from 'axios'; //INSTALL { npm i axios }

export const HelloWorld = () => {
    const [csvData, setCsvData] = useState([]);
    const [jsonData, setJsonData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
  
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      if (file.type !== 'text/csv') {
        setErrorMessage('Please select a CSV file.');
        return;
      }
  
      setErrorMessage(null); // Clear any previous errors
  
      reader.onload = (e) => {
        const csvContent = e.target.result;
        Papa.parse(csvContent, {
          complete: (results) => {
            setCsvData(results.data); // Store parsed CSV data (assuming it's an array)
            convertCsvToJson(results.data); // Call function to convert
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setErrorMessage('Error parsing CSV file.');
          },
        });
      };
  
      reader.readAsText(file);
    };
  
    const convertCsvToJson = (csvArray) => {
      // Check if csvArray is an array (optional, but recommended for safety)
      if (!Array.isArray(csvArray)) {
        console.error('Invalid CSV data format (not an array)');
        return;
      }
  
      // Extract header row from the first element (assuming Papa Parse doesn't return a header row)
      const headerRow = csvArray[0]; // Access the first element
  
      // Convert remaining data rows to JSON objects
      const jsonArray = csvArray.slice(1).map((rowData) => {
        const jsonObject = {};
        for (let i = 0; i < rowData.length; i++) {
          jsonObject[headerRow[i]] = rowData[i];
        }
        return jsonObject;
      });
  
      setJsonData(jsonArray); // Store converted JSON data
    };
    return (
        <div>
          <input type="file" onChange={handleFileUpload} />
          {errorMessage && <p className="error">{errorMessage}</p>}
          {csvData.length > 0 && (
            <div>
              <h2>Uploaded CSV Data</h2>
              <table>
                <thead>
                  <tr>
                    {/* Dynamically render table headers from CSV data */}
                    {csvData[0].map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((rowData, index) => (
                    <tr key={index}>
                      {rowData.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {jsonData && (
            <div>
              <h2>Converted JSON Data</h2>
              <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            </div>
          )}
        </div>
      );
}
