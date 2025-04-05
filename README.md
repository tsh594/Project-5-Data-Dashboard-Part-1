# Web Development Project 5 - Weather Dashboard

Submitted by: **Tasneem Shabana**

This web app: **A responsive weather dashboard displaying global weather data with interactive filtering and dynamic backgrounds**

Time spent: **8** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The site has a dashboard displaying a list of data fetched using an API call**
  - The dashboard should display at least 10 unique items, one per row (10 default locations)
  - The dashboard includes at least two features in each row (Temperature, Humidity, Wind, Conditions)
- [x] **`useEffect` React hook and `async`/`await` are used**
  - Used in fetchAllWeather, fetchWeather, and suggestion fetching
- [x] **The app dashboard includes at least three summary statistics about the data** 
  - The app dashboard includes at least three summary statistics about the data, such as:
    - Average Temperature
    - Minimum Temperature
    - Maximum Temperature
    - Total Locations Displayed
- [x] **A search bar allows the user to search for an item in the fetched data**
  - The search bar **correctly** filters items in the list, only displaying items matching the search query
  - The list of results dynamically updates as the user types into the search bar
- [x] **An additional filter allows the user to restrict displayed items by specified categories**
  - The filter restricts items in the list using a **different attribute** than the search bar 
  - The filter **correctly** filters items in the list, only displaying items matching the filter attribute in the dashboard
  - The dashboard list dynamically updates as the user adjusts the filter

The following **optional** features are implemented:

- [x] Multiple filters can be applied simultaneously (Temp + Wind + Conditions)
- [x] Filters use different input types
  - Range sliders for temperature and wind speed
  - Checkboxes for weather conditions
- [x] The user can enter specific bounds for filter values
  - Temperature range from -20°C to 50°C
  - Wind speed from 0-20 m/s

The following **additional** features are implemented:

* [x] Dynamic background images based on location continent
* [x] Hourly and 5-day forecast displays
* [x] Interactive weather icons for different conditions
* [x] Responsive design for all screen sizes
* [x] Loading states and error handling

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='Vite + React-desktop.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

**Challenges encountered:**
1. Managing multiple API calls (OpenWeatherMap, Unsplash, Pexels)
2. Synchronizing complex filter states
3. Implementing responsive design for weather cards
4. Handling API rate limits and errors
5. Optimizing background image loading performance

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