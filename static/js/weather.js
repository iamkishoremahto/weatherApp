




async function getCurrentTime(){
    let currentTime = new Date()
    return currentTime.toLocaleTimeString()
}

async function dayIndicatorHandler(){
    let hours = await getCurrentHour();
    let dayIndicatorElement = document.getElementById('day_indicator');
    hours = 17;
    left = -8;
    top = -13;


    
    dayIndicatorElement.style.left = `${left}%`;
  
    if(hours>0) dayIndicatorElement.style.top = '-13%';

    if(hours>=17){
        dayIndicatorElement.src = 'static/images/moon.png'
        let allCircles = document.querySelectorAll('.circles div');
        allCircles[0].style.backgroundColor = '#595561'
        allCircles[1].style.backgroundColor = '#52505b';
        allCircles[2].style.backgroundColor = '#4d4955';
        allCircles[3].style.backgroundColor = '#46424b';
        allCircles[3].style.boxShadow = 'rgba(0, 0, 0, 0.35) 0px 5px 15px';
        allCircles[4].style.backgroundImage = 'url(static/images/nightSky.jpg)';
        allCircles[4].style.backgroundSize = 'cover';
        let body = document.querySelector('body');
        body.style.backgroundColor = "#4d4955"

    }
}
async function getCurrentHour(){
    let time =  new Date();
    let hours = time.getHours();
    return hours
}



async function currentTimeHandler(){
      let time = await getCurrentTime();
      let timeElement = document.getElementById('time');
      timeElement.textContent = time;

}

async function weatherIconHandler(weatherCondition){
    let hours = await getCurrentHour()
    let weatherIcon = document.getElementById('weather_icon');
    let imageUrl;
    let currentSituation
    

    if(hours>= 0 && hours <=17){
        currentSituation = "day"
    }
    else{
        currentSituation = "night"
    }

    if (weatherCondition.includes("cloud")){
        if(currentSituation === "day"){
            imageUrl = "static/images/weather_icons/cloudy-day.svg"
        }
        else{
            imageUrl = "static/images/weather_icons/cloudy-night.svg"
        }
    }

    else if (weatherCondition.includes("rain")){
        
        imageUrl = "static/images/weather_icons/rainy-1.svg"
          
    }
    else{
        if(currentSituation === "day"){
            imageUrl = "static/images/weather_icons/day.svg"
        }
        else{
            imageUrl = "static/images/weather_icons/night.svg"
        }
    }

    weatherIcon.src = imageUrl

    
}

async function get_latitudeLongitude(){
    
    try{
      const positions = await new Promise((resolve, reject) =>{
  
          navigator.geolocation.getCurrentPosition(resolve, reject);
      })
  
      return positions.coords.latitude + "," + positions.coords.longitude;
    }
    catch(error){
      console.error(error);
    }  
  }
  
  
  
  async function get_weather_status(positions){
      const API_KEY = "ef02955217b24d4c802112728233009"
      const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
      const RootURL = "http://api.weatherapi.com/v1/current.json"
  
      const params = {
          key:API_KEY,
          q:positions
      }
  
      const queryParams = new URLSearchParams(params);
      const requestUrl = `${RootURL}?${queryParams}`
  
      const headers = new Headers();
  
      headers.append("Content-Type", "application/json");
  
      const request = new Request(requestUrl, { method: 'GET', headers: headers });

  
      let response = await fetch(request)

     
      return await response.json()
  
  
  
  }


async function getLatLong(address){
    const locationUrl =  "https://geocode.maps.co/search"
 
    const params = {
     q:address
    }
    const queryParams = new URLSearchParams(params);
    const requestUrl = `${locationUrl}?${queryParams}`

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const request = new Request(requestUrl, { method: 'GET', headers: headers });

    let response = await fetch(request)

    let data = await response.json()

    return (data[0].lat) + "," +(data[0].lon)
    
 }





async function getCurrentWeather(positions){
   
    let data =  await get_weather_status(positions);
    console.log(data);
    let temp = data.current.temp_c
    let condition = data.current.condition.text
    let wind_dir = data.current.wind_dir
    let wind_mph = data.current.wind_mph
    let humidity = data.current.humidity
    let location = data.location.name + " / " + data.location.region
    // wind_dir
    // wind_mph
    // humidity
  
return {temp: temp, condition:condition, humidity: humidity, wind_dir: wind_dir,wind_speed: wind_mph,location:location}    
    
}

async function weatherTempHandler(address="None"){
    if(address !== "None"){
    var positions = await getLatLong(address)
    console.log(positions)
    }
    else{
        var positions = await get_latitudeLongitude();
        console.log(positions)
    }

    data = await getCurrentWeather(positions);
    let tempElement = document.getElementById('temp')
    let conditionElement = document.getElementById('condition')
    let locationElement = document.getElementById('location')
    let windDirElement = document.getElementById('wind_dir')
    let windSpeedElement = document.getElementById('wind_speed')
    let humidityElement = document.getElementById('humidity')
    locationElement.textContent = data.location;
    conditionElement.textContent = data.condition;
    tempElement.textContent = `${data.temp}`;
    humidityElement.textContent = data.humidity;
    windDirElement.textContent = data.wind_dir;
    windSpeedElement.textContent = data.wind_speed;

    await weatherIconHandler(data.condition);
    let searchIcon = document.querySelector('#plus_icon span')
    searchIcon.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`

    // 

    // location
}

  
async function searchHandler(){
 
    let searchButton = document.querySelector('#search');
    searchButton.addEventListener('click', () =>{
        let searchValue = document.querySelector('#plus_icon input').value;
        
        let searchIcon = document.querySelector('#plus_icon span')
        searchIcon.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`
        weatherTempHandler(searchValue);
        searchValue.value = '';
       
        
    });
}


weatherTempHandler()

// getCurrentWeather();

setInterval(currentTimeHandler,1000)
weatherIconHandler()
dayIndicatorHandler();
searchHandler()



