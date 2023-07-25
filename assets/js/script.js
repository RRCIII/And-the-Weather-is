//getElementsById and querySelector 
const searchform = document.querySelector('.search-form');
const cityName = document.getElementById('city-name');
const searchBtn = document.getElementById('search-btn');
const section = document.querySelector('section');
const nextFiveDays = document.querySelector('.next-five-days');
const searchedCities = document.querySelector('.cities-searched');

//personal APIkey: OpenWeatherMap
const APIkey = "5c1d4eb10a710338c05be89784ee93af";

//global variables defined
let cityList = [];
let city = '';

// call OpenWeatherMap API for current weather  using .then 
const fetchData = (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${APIkey}`

    fetch(requestURL)
        .then((results) => {
            if(results.ok) {
               section.classList.remove('hide')
               addCityToList(cityName)
               return results.json() 
            } else {
                return
            }
        
        })
        .then ((data) => {
            // call OpenWeatherMap API for five day forecast 
            fetchFiveDays(cityName) 

            //add current weather to data to the html 
            document.getElementById('current-city').innerText = data.name;
            document.getElementById('current-date').innerText = `(${new Date().toLocaleDateString()})`;
            document.getElementById('current-icon').innerHTML = `<img src= 'http://openweathermap.org/img/w/${data.weather[0].icon}.png' />`;
            document.getElementById('current-temp').innerText = `Temp: ${data.main.temp}°F`;
            document.getElementById('current-wind').innerText = `Wind: ${data.wind.speed} MPH`;
            document.getElementById('current-humidity').innerText = `Humidity: ${data.main.humidity}%`;

            console.log(data);

        })
};

// call OpenWeatherMap API for five day/three hour weather data utilizing async() await
const fetchFiveDays = async(cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${APIkey}`;

    const response = await fetch(requestURL);

    const data = await response.json();

    //clear previous search results for five day forecast
    nextFiveDays.innerHTML = '';

    //get unix timestamp, convert to milliseconds, then add one day in ms, to get the dates of the next five days 
    //implemented data.list[7 + (8 * i)] will bring back 3pm data for each of the five day forescast
    for (let i = 0; i < 5; i++) {
        const nextDayForecast = document.createElement('div');
        nextDayForecast.classList.add('day');
        nextDayForecast.innerHTML = `
        <h3>${new Date(((data.list[0].dt) * 1000) + ((i + 1) * 86400000)).toLocaleDateString()}</h3>
        <img id="day-icon" src='http://openweathermap.org/img/wn/${data.list[7 + (8 * i)].weather[0].icon}.png' />
        <p>Temp: ${data.list[7 + (8 * i)].main.temp}°F</p>
        <p>Wind: ${data.list[7 + (8 * i)].wind.speed} MPH</p>
        <p>Humidity: ${data.list[7 + (8 * i)].main.humidity}%</p>
      `
        nextFiveDays.appendChild(nextDayForecast);
    }

    console.log(data);
};