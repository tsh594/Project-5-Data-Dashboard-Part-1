import { useState, useEffect, useRef } from 'react';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import './App.css';
import { createClient } from 'pexels';

const pexelsClient = createClient(import.meta.env.VITE_APP_PEXELS_KEY);

const DEFAULT_LOCATIONS = [
  'London,UK', 'New York,US', 'Tokyo,JP', 
  'Paris,FR', 'Sydney,AU', 'Dubai,AE',
  'Mumbai,IN', 'Berlin,DE', 'Toronto,CA',
  'São Paulo,BR'
];

const continentNatureKeywords = {
  'North America': ['national park', 'rocky mountains', 'great lakes', 'redwood forest'],
  'South America': ['amazon rainforest', 'andes mountains', 'iguazu falls', 'atacama desert'],
  Europe: ['alpine meadows', 'scottish highlands', 'norwegian fjords', 'black forest'],
  Asia: ['himalayan range', 'bamboo forest', 'japanese gardens', 'rice terraces'],
  Africa: ['sahara desert', 'serengeti plains', 'victoria falls', 'okavango delta'],
  Oceania: ['great barrier reef', 'australian outback', 'fiordland national park', 'tasmanian wilderness'],
  default: ['natural landscape', 'mountain range', 'forest', 'lake']
};

const App = () => {
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [weatherData, setWeatherData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [bgStyle, setBgStyle] = useState({ 
    background: 'linear-gradient(135deg, #2c5364, #203a43, #0f2027)' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tempRange: [-20, 50],
    windSpeed: 0,
    conditions: []
  });

  const apiCooldown = useRef(false);
  const suggestionsRef = useRef(null);
  const OWM_KEY = import.meta.env.VITE_APP_OWM_KEY;
  const UNSPLASH_KEY = import.meta.env.VITE_APP_UNSPLASH_KEY;

  // Get continent from coordinates
  const getContinent = (lon) => {
    if (lon >= -170 && lon <= -25) return 'North America';
    if (lon >= -80 && lon <= -35) return 'South America';
    if (lon >= -25 && lon <= 40) return 'Europe';
    if (lon >= 35 && lon <= 150) return 'Asia';
    if (lon >= -20 && lon <= 55) return 'Africa';
    return 'Oceania';
  };

  // Fetch background image
  const fetchBackgroundImage = async (continent) => {
    try {
      const keywords = continentNatureKeywords[continent] || continentNatureKeywords.default;
      const query = keywords[Math.floor(Math.random() * keywords.length)];
      
      const res = await fetch(`https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${UNSPLASH_KEY}`);
      const data = await res.json();
      
      setBgStyle({
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data.urls.regular})`
      });
    } catch (err) {
      console.error('Error fetching background:', err);
      setBgStyle({
        background: 'linear-gradient(135deg, #2c5364, #203a43, #0f2027)'
      });
    }
  };

  // Fetch weather for all locations
  useEffect(() => {
    const fetchAllWeather = async () => {
      try {
        setLoading(true);
        const promises = locations.map(async (location) => {
          const [city, country] = location.split(',');
          const data = await fetchWeather(`${city},${country}`);
          if (data && !weatherData.some(w => w.id === data.id)) {
            fetchBackgroundImage(getContinent(data.coord.lon));
          }
          return data;
        });
        
        const results = await Promise.all(promises);
        setWeatherData(results.filter(Boolean));
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllWeather();
  }, [locations]);

  // Fetch weather for single location
  const fetchWeather = async (query) => {
    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${OWM_KEY}`
      );
      if (!geoRes.ok) throw new Error('Geocoding API error');
      
      const [geoData] = await geoRes.json();
      if (!geoData) return null;

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geoData.lat}&lon=${geoData.lon}&units=metric&appid=${OWM_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geoData.lat}&lon=${geoData.lon}&units=metric&appid=${OWM_KEY}`)
      ]);

      if (!weatherRes.ok || !forecastRes.ok) throw new Error('Weather API error');

      const [weatherData, forecastData] = await Promise.all([
        weatherRes.json(),
        forecastRes.json()
      ]);

      return {
        ...weatherData,
        coordinates: geoData,
        forecast: forecastData.list
      };
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.message);
      return null;
    }
  };

  // Filter data based on search and filters
  const filteredData = weatherData.filter(data => {
    const matchesSearch = data.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTemp = data.main.temp >= filters.tempRange[0] && 
                       data.main.temp <= filters.tempRange[1];
    const matchesWind = data.wind.speed >= filters.windSpeed;
    const matchesConditions = filters.conditions.length === 0 || 
                             filters.conditions.includes(data.weather[0].main);
    
    return matchesSearch && matchesTemp && matchesWind && matchesConditions;
  });

  // Calculate statistics
  const stats = {
    avgTemp: filteredData.reduce((sum, data) => sum + data.main.temp, 0) / filteredData.length || 0,
    minTemp: Math.min(...filteredData.map(data => data.main.temp)),
    maxTemp: Math.max(...filteredData.map(data => data.main.temp)),
    totalLocations: filteredData.length
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search suggestions with debouncing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=${OWM_KEY}`
        );
        const data = await res.json();
        setSuggestions(data.map(({ name, state, country }) => 
          `${name}${state ? `, ${state}` : ''}, ${country}`));
      } catch (err) {
        console.error('Suggestions error:', err);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="app" style={bgStyle}>
      <div className="container">
        <div className="search-container">
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search city..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="glow-input"
            />
            <button 
              type="submit"
              className="search-btn"
              disabled={loading || !inputValue.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown" ref={suggestionsRef}>
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Temperature Range: {filters.tempRange[0]}°C to {filters.tempRange[1]}°C</label>
            <div className="range-inputs">
              <input
                type="range"
                min="-20"
                max="50"
                value={filters.tempRange[0]}
                onChange={(e) => setFilters({...filters, tempRange: [Number(e.target.value), filters.tempRange[1]]})}
              />
              <input
                type="range"
                min="-20"
                max="50"
                value={filters.tempRange[1]}
                onChange={(e) => setFilters({...filters, tempRange: [filters.tempRange[0], Number(e.target.value)]})}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Wind Speed: ≥ {filters.windSpeed} m/s</label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={filters.windSpeed}
              onChange={(e) => setFilters({...filters, windSpeed: Number(e.target.value)})}
            />
          </div>

          <div className="filter-group">
            <label>Weather Conditions:</label>
            <div className="condition-checkboxes">
              {['Clear', 'Clouds', 'Rain', 'Snow'].map(condition => (
                <label key={condition} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.conditions.includes(condition)}
                    onChange={() => setFilters({
                      ...filters,
                      conditions: filters.conditions.includes(condition)
                        ? filters.conditions.filter(c => c !== condition)
                        : [...filters.conditions, condition]
                    })}
                  />
                  <span className="checkmark"></span>
                  {condition}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h3>Avg Temp</h3>
            <p>{stats.avgTemp.toFixed(1)}°C</p>
          </div>
          <div className="stat-card">
            <h3>Min Temp</h3>
            <p>{stats.minTemp}°C</p>
          </div>
          <div className="stat-card">
            <h3>Max Temp</h3>
            <p>{stats.maxTemp}°C</p>
          </div>
          <div className="stat-card">
            <h3>Locations</h3>
            <p>{stats.totalLocations}</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="locations-list">
          {filteredData.length === 0 && !loading && (
            <div className="error-banner">No locations found matching your criteria</div>
          )}
          
          {filteredData.map(data => (
            <WeatherCard 
              key={data.id}
              weather={data}
              onClick={() => setSelectedLocation(data)}
              isSelected={selectedLocation?.id === data.id}
            />
          ))}
        </div>

        {selectedLocation && (
          <div className="weather-content">
            <Forecast forecast={{
              hourly: selectedLocation.forecast.slice(0, 8),
              daily: selectedLocation.forecast.filter((_, i) => i % 8 === 0)
            }} />
            <button 
              className="close-btn"
              onClick={() => setSelectedLocation(null)}
            >
              Back to List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;