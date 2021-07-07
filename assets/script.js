var apiKey = "95400ef45216da2ef1a74ed0a5e49d83"
var searchBtn = document.querySelector("#search")
var todayEl = document.getElementById("today");
var todayHeader = document.createElement("h3");
var todayContainer = document.createElement("div");
var todayCard = document.createElement("div");
var todayWind = document.createElement("p");
var todayHumidity = document.createElement("p");
var todayTemperature = document.createElement("p");
var todayUvIndex = document.createElement('p');

var searchHistory;


function searchInput () {
    var searchInput = document.querySelector("#search-input").value;
    console.log(searchInput);

    getCurrentWeather(searchInput);
    forecast(searchInput);
    saveSearchInput(searchInput);
    displaySearch();

    document.getElementById("search").value = "";
}

function getCurrentWeather (searchInput) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + apiKey + "&units=imperial";

    var removeTodayClass = document.getElementById("today-header");
    removeTodayClass.removeAttribute("class", "invisible");

    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            todayEl.textContent = "";

            todayHeader.className = "card-title";
            todayHeader.textContent = data.name + " - " + moment().format("MMMM Do, YYYY");

            todayContainer.className = "card bg-light";

            todayCard.className = "card-body";

            todayWind.className = "card-text";
            todayWind.textContent = "Wind: " + data.wind.speed + "MPH";

            todayHumidity.className = "card-text";
            todayHumidity.textContent = "Humidity: " + data.main.humidity + "%";

            todayTemperature.className = "card-text";
            todayTemperature.textContent = "Temperature: " + data.main.temp + "°F";

            todayUvIndex.className = "card-text";

            
            todayCard.appendChild(todayHeader);
            todayCard.appendChild(todayTemperature);
            todayCard.appendChild(todayHumidity);
            todayCard.appendChild(todayWind);
            todayContainer.appendChild(todayCard);
            todayEl.appendChild(todayContainer);

            var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey + "&cnt=1";

            fetch (uvQueryUrl) 
                .then(function(response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    todayUvIndex.textContent = "UV Index: " + data[0].value;

                    if (data[0].value < 8) todayUvIndex.className = "text-warning";
                    if (data[0].value < 4) todayUvIndex.className = "text-primary";
                    else todayUvIndex.className = "text-danger";

                    todayCard.appendChild(todayUvIndex);
                })
            })
     
};

function forecast (searchInput) {
    var forecastHeader = document.getElementById("forecast-header");
    forecastHeader.removeAttribute("class", "invisible");

    var forecastDisplay = document.getElementById("forecast-display");
    forecastDisplay.textContent = "";

    var forecastApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=" + apiKey + "&units=imperial";

    console.log(forecastApi);

    fetch(forecastApi)
        .then(function (response) {
            return response.json()
        })
        .then(function(data) {
            
            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.includes("12:00")) {
                
                var forecastEl = document.getElementById("forecast-display");
                var forecastCards = document.createElement('div');
                var forecastContainer = document.createElement('div');
                var forecastCard = document.createElement('div');
                var forecastHeader = document.createElement('h3');
                var forecastWind = document.createElement('p');
                var forecastHumidity = document.createElement('p');
                var forecastTemperature = document.createElement('p');

                forecastContainer.className = "card bg-primary text-white justify-content-evenly";

                forecastCard.className = "card-body p-2 me-1";

                forecastHeader.className = "card-title";
                forecastHeader.textContent = moment(data.list[i].dt_txt.split("12:")[0]).format("MMMM Do, YYYY");
                
                forecastWind.className = "card-text";
                forecastWind.textContent = "Wind Speed: " + data.list[i].wind.speed + " MPH";
                forecastHumidity.className = "card-text"
                forecastHumidity.textContent = "Humidity : " + data.list[i].main.humidity + "%";
                forecastTemperature.className = "card-text"
                forecastTemperature.textContent = "Temperature : " + data.list[i].main.temp_max + "°F";



                forecastCard.appendChild(forecastHeader);
                forecastCard.appendChild(forecastWind);
                forecastCard.appendChild(forecastHumidity);
                forecastCard.appendChild(forecastTemperature);
                forecastContainer.appendChild(forecastCard);
                forecastCards.appendChild(forecastContainer);
                forecastEl.appendChild(forecastContainer);
                }            
        }})
}

function saveSearchInput(searchInput) {

    if(JSON.parse(localStorage.getItem("history")) != null)
        searchHistory = JSON.parse(localStorage.getItem("history"));
    else    
        searchHistory = [];

    if(!searchHistory.includes(searchInput)){
        searchHistory.push(searchInput);
        localStorage.setItem("history", JSON.stringify(searchHistory));
    }
}

function displaySearch(){
    while (document.getElementById("history").firstChild) {
        document.getElementById("history").removeChild(document.getElementById("history").firstChild);
    }
    searchListHistory();
}

function searchListHistory () {
    searchHistory.forEach(function (searchInput){
        var historyItem = document.createElement("li");
        historyItem.className = "card list-search text-center m-1 p-2";
        historyItem.textContent = searchInput;
 
        historyItem.addEventListener("click", function(event){
            getCurrentWeather(event.target.textContent);
            forecast(event.target.textContent);
        });
        document.getElementById("history").appendChild(historyItem);
    });
}


searchBtn.addEventListener("click", searchInput);