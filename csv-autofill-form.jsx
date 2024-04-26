import React, { useState } from 'react';
import Papa from 'papaparse'; //INSTALL { npm i papaparse }

export const HelloWorld = () => {
    const [JSONData, setJSONData] = useState('');
    const [message, setMessage] = useState("");

    const CSVFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        if (file.type !== 'text/csv') {
            setMessage('Please select a CSV file.');
        } else {
            reader.onload = (e) => {
                const csvContent = e.target.result;
                Papa.parse(csvContent, {
                complete: (results) => {
                    convertCsvToJson(results.data);
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                    setJSONData("")
                },
                });
            };
            reader.readAsText(file);
        }
    };
  
    const convertCsvToJson = (csvArray) => {
        if (!Array.isArray(csvArray)) {
            setMessage('Invalid CSV data format (not an array)');
            setJSONData("")
        } else {
            const headerROW = csvArray[0];
            if(headerROW[0] != "idd" || headerROW[1] != "club" || headerROW[2] != "app" || headerROW[3] != "union" || headerROW[4] != "status"){
              setMessage("CSV wrong format!")
              setJSONData("")
            } else {

                const jsonArray = csvArray.slice(1).map((rowData) => {
                    const jsonObject = {};
                    for (let i = 0; i < rowData.length; i++) {
                    jsonObject[headerROW[i]] = rowData[i];
                    }
                    return jsonObject;
                });
                setJSONData(jsonArray); 
                setMessage('Successful CSV Upload');

            }
          
        }
    };

    const handleChange = (e, index, x) => {
        const updatedData = [...JSONData]; // Create a copy of the state array
        updatedData[index][x] = e.target.value;
        setJSONData(updatedData);
      };

    return (
        <div>
            <h1>{message}</h1>
          <input type="file" onChange={CSVFileUpload} />
          {/* CSV to JSON Format */}
          {JSONData && (
            <div>
                
                <form className='ui form'>
                    <h1>Form Fields</h1>
                        {JSONData.map((i, index) => (
                            <div className='fields' key={index}>
                                <div className='field'>
                                    <label>Club ID</label>
                                    <input id={index} value={i.idd} onChange={(e) => handleChange(e, index, "idd")}/>
                                </div>
                                <div className='field'>
                                    <label>Club Name</label>
                                    <input value={i.club} onChange={(e) => handleChange(e, index, "club")}/>
                                </div>
                                <div className='field'>
                                    <label>App Name</label>
                                    <input value={i.app} onChange={(e) => handleChange(e, index, "app")} />
                                </div>
                                <div className='field'>
                                    <label>Union Name</label>
                                    <input value={i.union} onChange={(e) => handleChange(e, index, "union")} />
                                </div>
                                <div className='field'>
                                    <label>Status</label>
                                    <input value={i.status} onChange={(e) => handleChange(e, index, "status")} />
                                </div>
                            </div>
                        ))}
                </form>
                <h2>Converted JSON Data</h2>
                <pre>{JSON.stringify(JSONData, null, 2)}</pre>
            </div>
          )}
        </div>
      );
}
