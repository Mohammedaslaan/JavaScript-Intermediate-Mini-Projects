// // const API_key = 'a41d21934c3f16ece9ba225b791a0743';
// async function fetchWeatherDetails(city){
//     try{
//         console.log('started');
//         let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`;
//         console.log('url');
//         let response = await fetch(url);
//         console.log(response);
//         const data = await response.json();
//         console.log(data.main.temp)
//     }
//     catch(err){
//         console.log(err);
//     }
    

// }


// const currLocaBtn = document.querySelector('[currLocaBtn]')
// let x = document.getElementById("demo");

// function showPosition(position) {
//   console.log(position)

// }

// currLocaBtn.addEventListener('click',()=>{
//     const success = (position)=>{
//         console.log(position);
//     }
//     const error = ()=>{
//         console.log('Unable to get locations')
//     }
//     navigator.geolocation.getCurrentPosition(success,error);
// })

// let searchBar = document.querySelector('.search-bar'); 
// const SearchWeatherBtn = document.querySelector('[SearchWeatherBtn]');
// const SearchBarInput = document.querySelector('[SearchBarInput]');
// const SearchBarBtn = document.querySelector('[SearchBarBtn]');
// function displayBar(){
//     searchBar.style.display = 'block'
// }

// SearchBarBtn.addEventListener('click',()=>{
//     console.log('submitted  ', SearchBarInput.value);
//     fetchWeatherDetails(SearchBarInput.value)
// })
// SearchBarInput.addEventListener('change',(e)=>{
//     e.preventDefault()
//     console.log(SearchBarInput.value)
// })



const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")
const grandAccessContainer = document.querySelector(".grand-location-container")
const searchForm = document.querySelector("[data-searchInput]")
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initailly required variable

let currentTab = userTab;
const API_key = 'a41d21934c3f16ece9ba225b791a0743';
currentTab.classList.add('current-tab')
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")
        if(!searchForm.classList.contains("active")){
            //kya search form wala container invisible the. if yes than usko visible kr rhe hain.
            userInfoContainer.classList.remove("active");
            grandAccessContainer.classList.remove("active");
            searchForm.classList.add("active")
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
})

//check if coordinates are already present in session storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grandAccessContainer.classList.add("active");
        
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //make grandContainer invisible
    grandAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active")

    //API call 
    try{
        const respone = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data = await respone.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch{
        loadingScreen.classList.remove("active");
    }
};

function renderWeatherInfo(data){
   // firstly we have to fetch the element
   const cityName = document.querySelector("[data-cityName]");
   const countryIcon = document.querySelector("[data-countryIcon]");
   const desc = document.querySelector("[data-weatherDiscription]")
   const weatherIcon = document.querySelector("[data-weatherIcon]")
   const temp = document.querySelector("[data-temp]")
   const windSpeed = document.querySelector("[data-windSpeed]")
   const humidity = document.querySelector("[data-humidity]")
   const cloudiness = document.querySelector("[data-cloudiness]")

   //fetch values from data object into ui element
   cityName.innerText = data?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.coutry.toLowercase()}.png`;
   desc.innerText = data?.weather?.[0]?.description;
   weatherIcon.src = `http://openweather.org/img/w/${data?.weather?.[0]?.icon}.png`;
   temp.innerText = data?.main?.temp;
   windSpeed.innerText = data?.wind?.speed;
   humidity.innerText = data?.main?.humidity;
   cloudiness.innerText = data?.clouds?.all;
}


function showPosition(position){
    const userCoordination = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordination));
    fetchUserWeatherInfo(userCoordination)
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        //Show alert for no geolocation support available
        alert('no geolocation support available');
    }
}
const grandAccessButton = document.querySelector("[data-grandAccess]");
grandAccessButton.addEventListener('click',getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value ==="") return;

    fetchSearchWeatherInfo(searchInput.value);
    
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grandAccessContainer.classList.remove("active");
    try{
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`;
        let response = await fetch(url);
        const data = await response.json();
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data)
    }
    catch(err){
        console.log(err);
    }
}
