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
    const requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${APIkey}`;

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

//add case sensitivity to city name; capitilize the first letter of the city
const caseSensitivity = (cityName) => {
    let updateCity = cityName.toLowerCase().split(" ");
    let returnCity = '';

    for(let i = 0; i < updateCity.length; i++) {
        updateCity[i] = updateCity[i][0].toUpperCase() + updateCity[i].slice(1);
        returnCity += " " + updateCity[i];
    }
    return returnCity.trim();
};

//add city to search history 
const addCityToList = (city) => {
    let newCity = caseSensitivity(city);

    let exist = false;

    //if searched city is already in the cityList array, exist is equal to true
    for (let c of cityList) {
        if (c === newCity) {
            exist = true
        }
    }

    //if city has not been searched before
    if (!exist) {
        //add city to the front of the array
        cityList.unshift(newCity)

        const cityBtn = document.createElement('button')
        cityBtn.classList.add('city-btn');
        cityBtn.innerText = `${cityList[0]}`;
        searchedCities.prepend(cityBtn);
    } else {
        return
    }

    // if the list of cities are > 8, then remove the last child from the element
    if(cityList.length > 8) {
        let nodes = document.querySelectorAll('.city-btn');
        let last = nodes[nodes.length -1];
        last.remove();
    }

    // set local storage w/ cityList array
    localStorage.setItem('cities', JSON.stringify(cityList));

    //addEventListner to each button w/ sity that was searched
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.removeEventListener('click', fetchData)
        btn.addEventListener('click', (e) => {
            fetchData(e.target.innerText)
        })
    })
};

//get local storage array from previous searches 
const getLocalStorage = () => {
    const storageList = JSON.parse(localStorage.getItem('cities'))

    // if local storage is empty this will return function as empty
    if (!storageList) {
        return false
    }

    //local storage cities, saved back into the inital citylist array
    cityList = storageList
    
    addstorageList()
};

//add cities to initial storageList upon initial render 
const addstorageList = () => {
    if (cityList.length > 0) {
        cityList.forEach(city => {
            const cityBtn = document.createElement('button')
            cityBtn.classList.add('city-btn')
            cityBtn.innerText = `${city}`
            searchedCities.append(cityBtn)
        })
    } else if (city.length > 8) {
        let nodes = document.querySelectorAll('city-btn')
        let last = nodes[nodes.length - 1]
        last.remove()
        cityList.pop()
    } else {
        return
    }

    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.removeEventListener('click', fetchData)
        btn.addEventListener('click', (e) => {
            fetchData(e.target.innerText)    
        })
    })
};

// on initial search, fetch data from OpenWeatherMap. clear the input box after searching. 
const onFormSubmit = (event) => {
    event.preventDefault()

    city = cityName.value; 

    cityName.value = '';


    // if a city is searched, the call fetcData. Otherwise, alert and stop function
    if(city) {
        fetchData(city)
    } else {
        alert("Please enter a city")
        return
    }
};

//addEventListner on thr search form 
searchform.addEventListener('submit', onFormSubmit);

//get local storage from the start 

getLocalStorage();
