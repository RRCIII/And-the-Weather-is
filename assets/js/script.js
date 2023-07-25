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
            document.getElementById('current-city').innerText = data.name
            document.getElementById('current-date').innerText = `(${new Date().toLocaleDateString()})`
            document.getElementById('current-icon').innerHTML = `<img src= 'http://openweathermap.org/img/w/${data.weather[0].icon}.png' />`
            document.getElementById('current-temp').innerText = `Temp: ${data.main.temp}°F`
            document.getElementById('current-wind').innerText = `Wind: ${data.wind.speed} MPH`
            document.getElementById('current-humidity').innerText = `Humidity: ${data.main.humidity}%`

            console.log(data)

        })
};