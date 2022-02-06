//global variables
//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
let API_KEY = "e66d17359144f3dc37b495d667136547";
const searchBtn = document.querySelector(".search");
const inputText = document.querySelector("#search");
const tempUI = document.querySelector(".temp");
const cityUI = document.querySelector(".city-info li");
const descriptionUI = document.querySelector(".weather-info small");
const dateUI = document.querySelector(".date");
const lonUI = document.querySelector(".lon");
const latUI = document.querySelector(".lat");
const humUI = document.querySelector(".hum");
const preUI = document.querySelector(".pre");
const winUI = document.querySelector(".win");
const riseUI = document.querySelector(".rise");
const setUI = document.querySelector(".set");
const cloudUI = document.querySelector(".cloud");
const rainUI = document.querySelector(".rain");
const snowdUI = document.querySelector(".snow");
const iconImg = document.querySelector("#icon");
const otherBtn = document.querySelector("#options button");
const closeBtn = document.querySelector(".close");
const languageUI = document.querySelector("#language")
const searchBarUI = document.querySelector(".search-bar-container");
const lonIn = document.querySelector(".lon-in");
const latIn = document.querySelector(".lat-in");
const userForm = document.querySelector(".user-form");
const weekArr = ["Sunday","Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"];
const  monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
//dataStructure maintained for updating localstorage
let datastructure = {};
//get data form api
//return type -> object
function requestHandler(city,callback,lang){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e66d17359144f3dc37b495d667136547&lang=${lang}`).then((res)=>{
        res.ok ? res.json() : new Error("error status code : "+ res.status);
    }).then((data)=>{
        if(data === undefined){
            alert("something went wrong");
        }else{
            callback(data);
        }    
    }).catch(err =>{
        console.log(err);
    })       
}
//getText from input field
//return type -> string
function getText(){
    return inputText.value;
}
//convert from kelvin to celcious
//return Type -> int
function toCelcious(temp){
    return Math.floor(temp - 273.15);
}
//getDate will return date based on timezon
//return type -> date Object
function getDate(timezone){
    let UTC = new Date();
    UTC.setFullYear(UTC.getUTCFullYear());
    UTC.setUTCMonth(UTC.getUTCMonth());
    UTC.setDate(UTC.getUTCDate());
    UTC.setHours(UTC.getUTCHours());
    UTC.setMinutes(UTC.getUTCMinutes());
    UTC.setSeconds(UTC.getUTCSeconds());
    UTC.setMilliseconds(UTC.getUTCMilliseconds());
    UTC.setSeconds(UTC.getSeconds() + timezone);
    return UTC;
}
//convert unixtimestamp to
function unixToDate(unixTimeStamp){
    return new Date(unixTimeStamp * 1000);
}
//adddToLocalstorage
function addToLocalstorage(){
    localStorage.setItem("data", JSON.stringify(datastructure));
}
//update user interface
function updateUI(data){
    let temp = data.main.temp;
    let timezone = data.timezone;
    let currentDate = getDate(timezone);
    //updating ui
    tempUI.innerHTML = `${toCelcious(temp)}<sup>o</sup>c`;
    cityUI.textContent = data.name;
    descriptionUI.textContent = data.weather[0].description;
    dateUI.innerHTML = `<span>${currentDate.getHours()}</span>:<span>${currentDate.getMinutes()}</span>-<span>${weekArr[currentDate.getDay()]}</span> <span>${currentDate.getDate()}</span> <span>${monthArr[currentDate.getMonth()]}</span> <span>${currentDate.getFullYear()}</span>`;
    lonUI.textContent = data.coord.lon;
    latUI.textContent = data.coord.lat;
    humUI.textContent = data.main.humidity;
    preUI.textContent = data.main.pressure;
    winUI.textContent = `${data.wind.speed}(${data.wind.deg}deg)`;
    riseUI.textContent = `${unixToDate(data.sys.sunrise).getHours()}:${unixToDate(data.sys.sunrise).getMinutes()}AM`;
    setUI.textContent = `${unixToDate(data.sys.sunset).getHours()}:${unixToDate(data.sys.sunset).getMinutes()}PM`;
    cloudUI.textContent = `${data.clouds === undefined ? "" : data.clouds.all}%`;
    rainUI.textContent = `${data.rain === undefined ? "0" : data.rain["1h"]}mm`;
    snowdUI.textContent = `${data.snow === undefined ? "0" : data.snow["1h"]}mm`;
    iconImg.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    datastructure = data;
    addToLocalstorage();
}
//language options options
languageUI.addEventListener("change", ()=>{
      localStorage.setItem("selectedIndex", languageUI.selectedIndex);
      let text = getText();
      let lang = languageUI.value;
      //requesting API for data
      requestHandler(text,(data)=>{
          updateUI(data);
      },lang)
})
//adding eventListner to searchBtn
searchBtn.addEventListener("click", ()=>{
    let text = getText();
    let lang = languageUI.value;
    //requesting API for data
    requestHandler(text,(data)=>{
        updateUI(data);
    },lang)
})
document.addEventListener("DOMContentLoaded", ()=>{
    let data = localStorage.getItem("data");
    if(data === null){
        requestHandler("punalur",(data)=>{
            updateUI(data);
        },"en")
    }else{
        updateUI(JSON.parse(localStorage.getItem("data")))
    }
    updateUI(JSON.parse(data));
    if(localStorage.getItem("selectedIndex") === null){
        localStorage.setItem("selectedIndex", 0);
    }else{
        languageUI.selectedIndex = localStorage.getItem("selectedIndex");
    }
})
window.addEventListener("error", (e)=>{
    console.log(e);
}, true)