import { truncate } from 'lodash'
import { useState } from 'react'
import './Weather.css'

import RadioButton from './RadioButton'
import WeatherDisplay from './WeatherDisplay'

function Weather() {
  const [zip, setZip] = useState('94103')
  const [unit, setUnit] = useState('')
  const [data, setData] = useState(null)

  // -------------------------------

  function fetchWeatherByGeo() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0    
    }

    // get geo coords
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      const apiKey = process.env.REACT_APP_API_KEY;
      const path = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
      fetchWeather(path)
    }, err => {
      console.log(err.message)
    }, options)
    

  }

  function fetchWeatherByZip() {
    const apiKey = process.env.REACT_APP_API_KEY;
    const path = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=${unit}`;
    fetchWeather(path)
  }

  async function fetchWeather(path) {
    // convert to json
    const res = await fetch(path)
    const json = await res.json()
    // console.log(json)

    //  error handling
    const cod = json.cod
    const message = json.message

    if (cod !== 200) {
      setData({ cod, message })
      return
    }

    // success properties
    const temp = json.main.temp
    const feelsLike = json.main.feels_like
    const description = json.weather[0].description

    // setData
    setData({
      cod,
      message,
      temp,
      feelsLike,
      description
    })
  }
  // -------------------------------

  return (
    <div className="Weather">
      {/* {data && <WeatherDisplay {...data} />} */}
      {data ? <WeatherDisplay {...data} /> : <p>Ready</p>}
      <h1>{zip} {unit}</h1>

      <form onSubmit={e => {
        e.preventDefault()
        fetchWeatherByZip()
      }}>

        <div>
          <input
            placeholder="Enter Zip Code"
            value={zip}
            onChange={e => setZip(e.target.value)}
          />
          <button>Submit</button>
        </div>
        <select
          onChange={e => setUnit(e.target.value)}
          value={unit}
        >
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
          <option value="standard">Kelvin</option>
        </select>

        <RadioButton
          label="metric"
          name="unit"
          checked={unit === 'metric'}
          onChange={() => setUnit('metric')}
        />

        <RadioButton
          label="imperial"
          name="unit"
          checked={unit === 'imperial'}
          onChange={() => setUnit('imperial')}
        />

        <RadioButton
          label="standard"
          name="unit"
          checked={unit === 'standard'}
          onChange={() => setUnit('standard')}
        />

      </form>
      <button
        onClick={() => fetchWeatherByGeo()}
      >Get weather by location</button>
    </div>
  )
}

export default Weather