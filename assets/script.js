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


function searchInput () {
    var searchInput = document.querySelector("#search-input").value;
    console.log(searchInput);

    getCurrentWeather(searchInput);
    // forecast(searchInput);
    // saveSearch(searchInput);
    // displaySearch(searchInput);
}

function getCurrentWeather (searchInput) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + apiKey + "&units=imperial";

    var removeTodayClass = document.getElementById("today-header");
    removeTodayClass.removeAttribute("class", "invisble");

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



searchBtn.addEventListener("click", searchInput);