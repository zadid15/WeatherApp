const apiKey = "e2cc3211ca8d5f4ed42cfaadadbec92d";
const button = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// Inisialisasi peta
const map = L.map("map").setView([-7.4214, 112.0089], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

document.getElementById("weatherForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    document.getElementById(
      "weatherResult"
    ).innerHTML = `<p class="text-red-500">Silakan masukkan nama kota</p>`;
  }
});

window.onload = () => {
  cityInput.focus();
};

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kota tidak ditemukan");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
      const { coord } = data;
      addMarker(coord.lat, coord.lon, city);
    })
    .catch((error) => {
      document.getElementById(
        "weatherResult"
      ).innerHTML = `<p class="text-red-500">${error.message}</p>`;
    });
}

function displayWeather(data) {
  const { name, main, weather } = data;
  const weatherResult = document.getElementById("weatherResult");
  weatherResult.innerHTML = `
                <h2 class="text-2xl font-extrabold text-blue-600">Weather in ${name}</h2>
                <p class="text-lg">Temperature: <span class="font-bold">${main.temp} °C</span></p>
                <p class="text-lg">Humidity: <span class="font-bold">${main.humidity}%</span></p>
                <p class="text-lg">Condition: <span class="font-bold capitalize">${weather[0].description}</span></p>`;
  weatherResult.classList.remove("hidden");
  weatherResult.classList.add(
    "transition",
    "duration-800",
    "ease-in-out",
    "opacity-0"
  );

  void weatherResult.offsetWidth;

  weatherResult.classList.remove("opacity-0");
  weatherResult.classList.add("opacity-100");
}

function addMarker(lat, lon, city) {
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`City: ${city}`).openPopup();
  map.setView([lat, lon], 12);
}
