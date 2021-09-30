document.addEventListener("DOMContentLoaded", function (event) {
  const apiKey = "b29b8d284600575457c53d307f1c9e22";
  const lat = 44.37408937000131;
  const lon = -79.70726579049291;
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

  let currentTemp = document.getElementById("current-temp");
  let feelsLike = document.getElementById("feels-like");
  let windSpeed = document.getElementById("wind-speed");
  let windDirection = document.getElementById("wind-direction");
  let humidity = document.getElementById("humidity");
  let UVIndex = document.getElementById("uv-index");
  let cloudiness = document.getElementById("cloudiness");

  let hourlyCards = document.querySelectorAll(".card");
  let hourlyNext = document.querySelector(".carousel-next");
  let hourlyPrev = document.querySelector(".carousel-prev");

  //fetch the api endpoint
  let call = fetch(url)
    //parse the response as a json (I THINK)
    .then((response) => response.json())
    //call this function
    .then(function (data) {
      //set all the current weather data
      currentTemp.innerText = data.current.temp;
      feelsLike.innerText = data.current.feels_like;
      windSpeed.innerText = data.current.wind_speed;
      //calculate the north,east,south,west wind direction
      if (data.current.wind_deg >= 340 || data.current.wind_deg <= 20) {
        windDirection.innerText = "N";
      }
      windDirection.innerText = data.current.wind_deg;
      humidity.innerText = data.current.humidity;
      UVIndex.innerText = data.current.uvi;
      cloudiness.innerText = data.current.clouds;

      //get the current hour so I can have the correct hour displayed in hourly weather
      let currentHour = new Date().getHours();
      let hour = currentHour.toLocaleString([], { hour12: true });
      //set the hour offset so I can chnage the time foward with buttons
      let hourOffset = 1;

      //click event for forward and back buttons
      hourlyNext.addEventListener("click", hourlyForward);
      hourlyPrev.addEventListener("click", hourlyBack);
      //call function to chnage the backaground based on current weather
      changeBackground();
      currentUnits();
      updateHourlyWeather();

      function updateHourlyWeather() {
        //loop over the hourlyCards node list to set the hourly data intially
        for (let i = 0; i < hourlyCards.length; i++) {
          if (currentHour + hourOffset >= 20) {
            hourOffset = 0;
            if (AMPM === "PM") {
              AMPM = "AM";
            } else {
              AMPM = "PM";
            }
            hourlyCards[i].children[1].innerText = 12 + AMPM;
          } else if (currentHour + hourOffset > 12) {
            AMPM = "PM";
            hourlyCards[i].children[1].innerText =
              currentHour + i + hourOffset - 12 + AMPM;
          } else {
            AMPM = "AM";
            hourlyCards[i].children[1].innerText =
              currentHour + i + hourOffset + AMPM;
          }
          hourlyCards[i].children[2].innerText =
            data.hourly[i + hourOffset].temp + "°C";
          hourlyCards[i].children[3].innerText =
            "Feels " + data.hourly[i + hourOffset].feels_like + "°C";
          hourlyCards[i].children[4].innerText =
            data.hourly[i + hourOffset].pop * 100 + "%";
        }
      }

      //jump forward 5 hours when the forward button is pressed and display thr new data
      function hourlyForward() {
        let AMPM = "AM";
        hourOffset += 1;
        for (let i = 0; i < hourlyCards.length; i++) {
          // console.log(hourOffset + currentHour);
          updateHourlyWeather();
        }
      }

      //go back by 5 hours and display the new data
      function hourlyBack() {
        console.log(hourOffset);
        console.log(hourlyCards.length);
        if (hourOffset > 1) {
          hourOffset -= 1;
          for (let i = 5; i > 0; i--) {
            console.log(i);
            if (currentHour + i + hourOffset > 12) {
              hourlyCards[i].children[1].innerText =
                currentHour + i + hourOffset - 12;
            } else {
              hourlyCards[i].children[1].innerText =
                currentHour + i + hourOffset;
            }
            hourlyCards[i].children[2].innerText =
              data.hourly[i + hourOffset].temp + "°C";
            hourlyCards[i].children[3].innerText =
              "Feels " + data.hourly[i + hourOffset].feels_like + "°C";
            hourlyCards[i].children[4].innerText =
              data.hourly[i + hourOffset].pop * 100 + "%";
          }
        }
      }

      //change the background depending on the time of day and cloudiness
      function changeBackground() {
        if (data.current.clouds <= 25) {
          document.body.style.background =
            "url('/img/sunny.jpg') no-repeat 10% top";
        } else if (data.current.pop * 100 > 65) {
          document.body.style.background =
            "url('/img/rainy.jpg') no-repeat 10% top";
        } else if (data.current.clouds <= 25 && currentHour < 8) {
          document.body.style.background =
            "url('/img/clear-night.jpg') no-repeat 10% top";
          document.body.style.color = "white";
        } else if (data.current.clouds > 80) {
          document.body.style.background =
            "url('/img/cloudy.jpg') no-repeat 10% center";
          document.body.style.color = "white";
        }
      }

      function currentUnits() {
        let metric = document.getElementById("C");
        let imperial = document.getElementById("F");
        metric.addEventListener("click", () => {
          if (units === "imperial") {
            units = "metric";
            url =
              "https://api.openweathermap.org/data/2.5/onecall?lat=" +
              lat +
              "&lon=" +
              lon +
              "&units=" +
              units +
              "&appid=" +
              apiKey;
            call = fetch(url);
          }
        });

        imperial.addEventListener("click", () => {
          console.log("hey");
          if (units === "metric") {
            units = "imperial";
            url =
              "https://api.openweathermap.org/data/2.5/onecall?lat=" +
              lat +
              "&lon=" +
              lon +
              "&units=" +
              units +
              "&appid=" +
              apiKey;
            call = fetch(url);
          }
        });
      }
    });
});
