import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiThermometer, WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';

const WeatherCard = ({ weather, onClick, isSelected }) => {
  const getWeatherIcon = (main) => {
    const iconSize = 80;
    switch(main.toLowerCase()) {
      case 'clear': 
        return <WiDaySunny size={iconSize} className="weather-icon-sunny" />;
      case 'rain': 
        return <WiRain size={iconSize} className="weather-icon-rain" />;
      case 'snow': 
        return <WiSnow size={iconSize} className="weather-icon-snow" />;
      case 'clouds': 
        return <WiCloudy size={iconSize} className="weather-icon-cloudy" />;
      default: 
        return <WiDaySunny size={iconSize} className="weather-icon-sunny" />;
    }
  };

  return (
    <div 
      className={`weather-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="location-info">
        <h1 className="city-name">{weather.name}</h1>
        <div className="location-details">
          <span>{weather.sys.country}</span>
          <span>Lat: {weather.coord.lat.toFixed(2)}</span>
          <span>Lon: {weather.coord.lon.toFixed(2)}</span>
        </div>
      </div>

      <div className="current-weather">
        <div className="weather-icon">
          {getWeatherIcon(weather.weather[0].main)}
        </div>
        <div className="temperature">
          {Math.round(weather.main.temp)}°C
          <div className="feels-like">
            <WiThermometer className="thermometer-icon" /> 
            Feels like {Math.round(weather.main.feels_like)}°C
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <WiHumidity className="humidity-icon" />
          <div className="detail-text">
            <span>Humidity</span>
            <span>{weather.main.humidity}%</span>
          </div>
        </div>
        <div className="detail-item">
          <WiStrongWind className="wind-icon" />
          <div className="detail-text">
            <span>Wind</span>
            <span>{weather.wind.speed} m/s</span>
          </div>
        </div>
        <div className="detail-item">
          <WiSunrise className="sunrise-icon" />
          <div className="detail-text">
            <span>Sunrise</span>
            <span>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="detail-item">
          <WiSunset className="sunset-icon" />
          <div className="detail-text">
            <span>Sunset</span>
            <span>{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;