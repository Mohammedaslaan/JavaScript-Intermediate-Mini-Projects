const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container")
const grandAccessContainer = document.querySelector(".grand-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initialization of variable
const API_key = 'a41d21934c3f16ece9ba225b791a0743';
let currentTab = userTab;
currentTab.classList.add("current-tab"); // adding gray background to current tab. that is userTab default.
getfromSessionStorage()

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            //agar searchform wali div me active class nhi padhi hui hai.
            //mtlb mene dusre wale tab pe click kiya hai aur mujhe isko/
            //active krna hai.
            grandAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            loadingScreen.classList.add("active");
            searchForm.classList.add("active")

        }else{
            // main phle search wale tab par tha an your weather tab visible krna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aa gya hoon. to weather bhi display krna padehga.
            //so check local storage first for coordinates.
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener('click',()=>{
    switchTab(userTab); // passing current tab as an input to change into other tab
});

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});
//check if coordinates are there in local storage or not
function getfromSessionStorage(){
    // if coordinate is there than name must be user-coordinate
    const localCoordinates = sessionStorage.getItem("user-coordiantes");
    if(!localCoordinates){
        //agar local coordinate nhi hai. to grandlocation window show kro
        grandAccessContainer.classList.add("active")
    }else{
        //agar local coordinate padhe huye hai to unko use krke api call krdo
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //make grandcontainer invisible
    grandAccessContaine.classList.remove("active")
    loadingScreen.classList.add("active")
    // api call
    try{
        const respone = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data = await respone.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // abhi to bas userInfoContainer active hua hai. abhi
        //abhi usme data fill krna hai.
        renderWeatherInfo(data);
    }
    catch (err){
        loadingScreen.classList.remove("active");

    }

}

function renderWeatherInfo(data){
    // firstly we have to fetch the elements we want to render
    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherDiscription]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]")
    const windSpeed =document.querySelector("[data-windSpeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness  =document.querySelector("[data-cloudiness")

    // now fill these elements from data objects
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
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else{
        alert('No Geolocation Api support')
    }
}
const grandAccessButton = document.querySelector('[data-grandAccess]';)
grandAccessButton.addEventListener('click',getLocation)

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value ===""){
        return;
    }else{
        fetchSearchWeatherInfo(searchInput.value)
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active")
    grandAccessContainer.classList.remove("active")
    try{
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`;
        let response = await fetch(url);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data)
    }
    catch(err){
         console.log(err);
    }
}