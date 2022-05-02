getLocation();

function getLocation() {
  let geolocation = navigator.geolocation;
  geolocation.getCurrentPosition(showLocation, getCityByIp);
}

function showLocation(position) {
  let lat = position.coords.latitude,
    long = position.coords.longitude;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=d0e0d4111b038bf7a68122c261d1b93b`
  ).then((data) => getWeather(data));
}

function getWeatherByCity(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d0e0d4111b038bf7a68122c261d1b93b`
  )
    .then((data) => getWeather(data))
    .catch((err) => alert("error"));
}

function getCityByIp() {
  try {
    fetch("https://api.ipify.org/?format=json")
      .then((response) => response.json())
      .then((data) => {
        fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_cqYxBr2Cfby9lFHDwPEfmwJSro9sD&ipAddress=${data.ip}`
        )
          .then((data) => data.json())
          .then((data) => getWeatherByCity(data.location.city));
      });
  } catch (err) {
    alert("Error");
    changeCity();
  }
}

function weatherOut(object) {
  document.querySelector(".card").insertAdjacentHTML(
    "afterbegin",
    `      <div class="temp"></div>
  <div class="city"></div>
  <div class="changeCity">Change city</div>   `
  );
  document.querySelector(
    ".city"
  ).innerText = `Weather in ${object.name} \nis ${object.description}`;
  document.querySelector(".temp").innerText = `${Math.floor(
    object.temp - 273.15
  )}℃`;
  document.querySelector(".changeCity").addEventListener("click", changeCity);
}

function getWeather(data) {
  try {
    data = data.json().then((data) => {
      const { name } = data;
      const { temp } = data.main;
      const { description } = data.weather[0];
      weatherOut({ name, temp, description });
    });
  } catch (err) {
    alert("Error");
    changeCity();
  }
}

function changeCity() {
  document.querySelector(".card").innerText = "";
  document.querySelector(".card").insertAdjacentHTML(
    "afterbegin",
    `
    <input id="input" placeholder="Type your city here"/>
    <button onclick="find()">Find</button>
    `
  );
}
function find() {
  city = document.getElementById("input").value;
  document.querySelector(".card").innerText = "";
  getWeatherByCity(city);
}
