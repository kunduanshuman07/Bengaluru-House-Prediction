import React, { useEffect, useState } from 'react';
import "./App.css";

const bhkOptions = [1, 2, 3, 4, 5];
const bathOptions = [1, 2, 3, 4, 5];

const App = () => {
  const [locations, setLocations] = useState({});
  const [predictedPrice, setPredictedPrice] = useState(0);
  const [formData, setFormData] = useState({
    bhk: '',
    bath: '',
    location: '',
    total_sqft: '',
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = 'http://localhost:5000/predict_home_price';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      const prediction = await responseData.estimated_price;
      setPredictedPrice(prediction);
    } catch (error) {
      console.log("Error", error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/get_location_names")
      const data = await response.json();
      const dataLocations = data?.locations;
      setLocations(dataLocations);
    }
    fetchData();
  }, [])
  return (
    // 
    <div className="form-container">
      {predictedPrice === 0 ? (<form className="custom-form" onSubmit={handleSubmit}>
        <h2>Bengaluru House Price Prediction</h2>
        <div className="form-group">
          <label htmlFor="bhk">BHK</label>
          <select
            id="bhk"
            name="bhk"
            value={formData.bhk}
            onChange={handleInputChange}
            required
          >
            <option value="">Select BHK</option>
            {bhkOptions.map((bhk, index) => (
              <option key={index} value={bhk}>
                {bhk}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="bath">Bathroom</label>
          <select
            id="bath"
            name="bath"
            value={formData.bath}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Bathroom</option>
            {bathOptions.map((bath, index) => (
              <option key={index} value={bath}>
                {bath}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="total_sqft">Area (in sqft)</label>
          <input
            type="number"
            id="total_sqft"
            name="total_sqft"
            value={formData.total_sqft}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Locations</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Location</option>
            {Object.values(locations).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>) : (<div className='custom-form'>
        <h2>The Predicted Price for {formData.bhk} BHK House in "{formData.location}, Bengaluru" is </h2>
        <div className='form-group'>
          <h2>INR {predictedPrice} Lakhs</h2>
        </div>
        <button onClick={()=>setPredictedPrice(0)}>Reset</button>
      </div>)}
    </div>
  )
}

export default App