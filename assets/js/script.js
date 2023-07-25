var APIkey = "5c1d4eb10a710338c05be89784ee93af";
var cityName = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${APIkey}`;

//getElementsById and querySelector 
const searchform = document.querySelector('.search-form');
const citName = document.getElementById('city-name');
const searchBtn = document.getElementById('search-btn');
const section = document.querySelector('section');
const nextFiveDays = document.querySelector('.next-five-days');
const searchedCities = document.querySelector('.cities-searched');
