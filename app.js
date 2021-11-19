document.addEventListener("DOMContentLoaded", function (event) {
  //Call the API
  const apiKey = "b29b8d284600575457c53d307f1c9e22";
  const lat = 43.688822;
  const lon = -79.411199;
  let units = "metric";
  let url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=" +
    units +
    "&appid=" +
    apiKey;

  //get all the elements for current weather
  let currentTemp = document.getElementById("current-temp");
  let feelsLike = document.getElementById("feels-like");
  let windSpeed = document.getElementById("wind-speed");
  let windDirection = document.getElementById("wind-direction");
  let humidity = document.getElementById("humidity");
  let UVIndex = document.getElementById("uv-index");
  let cloudiness = document.getElementById("cloudiness");

  //get the hourly elements
  let hourlyCards = document.querySelectorAll(".card");
  // let hourlyNext = document.querySelector(".carousel-next");
  // let hourlyPrev = document.querySelector(".carousel-prev");

  let changeTime = 0;

  //fetch the api endpoint
  let call = fetch(url)
    //parse the response as a json (I THINK)
    .then((response) => response.json())
    //call this function
    .then(function (data) {
      console.log(data.hourly);
      console.log(new Date(data.hourly[0].dt * 1000).toLocaleString());
      main();

      // --- CURRENT ISSUE, looping through and trying to put all the items into the cards in the dom, should just be storing them ---
      function main() {
        for (let i = 0; i < 5; i++) {
          //get the time as a 12 hour time
          let unixTime = data.hourly[i + changeTime].dt;
          let localDate = new Date(unixTime * 1000).toLocaleString();
          let localTime = localDate.substring(localDate.indexOf(" "));

          currentTemp.innerText = Math.round(data.current.temp);
          feelsLike.innerText = Math.round(data.current.feels_like);
          windSpeed.innerText = Math.round(data.current.wind_speed);
          humidity.innerText = data.current.humidity;
          UVIndex.innerText = data.current.uvi;
          cloudiness.innerText = data.current.clouds;

          //click event for forward and back buttons
          // hourlyNext.addEventListener("click", hourlyForward);
          // hourlyPrev.addEventListener("click", hourlyBack);
          // console.log(i);

          //set the time on the cards
          hourlyCards[i].children[1].innerText = localTime;

          //set the hourly temp
          hourlyCards[i].children[2].innerText =
            Math.round(data.hourly[i + changeTime].temp) + "°C";

          //set the feels like temp
          hourlyCards[i].children[3].innerText =
            "Feels  " +
            Math.round(data.hourly[i + changeTime].feels_like) +
            "°C";

          //set the % of precipitation
          hourlyCards[i].children[4].innerText = data.hourly[i].pop * 100 + "%";
        }
      }

      // function hourlyForward() {
      //   changeTime += 1;
      //   console.log(changeTime);
      //   main();
      //   //return changeTime;
      // }

      // function hourlyBack() {
      //   let changeTime = 0;
      //   changeTime -= 1;
      //   main();

      //   //return changeTime;
      // }
    });
});
