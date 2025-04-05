# Weather Dashboard 🌦️

Submitted by: **Tasneem Shabana**

This web app provides a comprehensive weather monitoring dashboard with global city data, real-time filtering, and dynamic background imagery.

Time spent: **X** hours spent in total

## Features

### Required Features

- [x] **The site has a dashboard displaying a list of data fetched using an API call**
  - Displays 10+ global cities (London, New York, Tokyo, etc.)
  - Each row shows temperature, humidity, wind speed, and conditions
- [x] **`useEffect` React hook and `async`/`await` are used**
  - Used in `fetchAllWeather`, `fetchWeather`, and suggestion fetching
- [x] **The app dashboard includes at least three summary statistics about the data**
  - Average Temperature
  - Minimum Temperature
  - Maximum Temperature
  - Total Locations Displayed
- [x] **A search bar allows the user to search for an item in the fetched data**
  - Live city search with suggestions
  - Dynamic filtering as users type
- [x] **An additional filter allows the user to restrict displayed items by specified categories**
  - Temperature range (-20°C to 50°C)
  - Wind speed threshold (0-20 m/s)
  - Weather conditions (Clear, Clouds, Rain, Snow)

### Optional Features

- [x] Multiple filters can be applied simultaneously
- [x] Filters use different input types
  - Range sliders for temperature and wind
  - Checkboxes for weather conditions
- [x] The user can enter specific bounds for filter values
  - Custom temperature range bounds
  - Precise wind speed selection

### Additional Features

- [x] Dynamic background images based on location continent
- [x] Hourly and 5-day forecast displays
- [x] Error handling and loading states
- [x] Responsive design for all screen sizes
- [x] Interactive weather condition icons

## Video Walkthrough


## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='Vite + React-desktop.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Technical Implementation

**Key Components:**
- Fetches data from OpenWeatherMap API (weather + forecasts)
- Uses Unsplash API for dynamic background images
- Implements Pexels as fallback image source
- React hooks for state management (useState, useEffect, useRef)
- Async/await for API calls
- Debounced search suggestions

**Filter Logic:**
```javascript
const filteredData = weatherData.filter(data => {
  const matchesSearch = data.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesTemp = data.main.temp >= filters.tempRange[0] && 
                     data.main.temp <= filters.tempRange[1];
  const matchesWind = data.wind.speed >= filters.windSpeed;
  const matchesConditions = filters.conditions.length === 0 || 
                           filters.conditions.includes(data.weather[0].main);
  
  return matchesSearch && matchesTemp && matchesWind && matchesConditions;
});


## License

    Copyright 2025 Tasneem Shabana

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.