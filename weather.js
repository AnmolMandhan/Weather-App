const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');
const getWeatherBtn = document.getElementById('getWeather');
const output = document.getElementById('output');
const themeToggle = document.getElementById('themeToggle');
const apiKey = "ec14239070465c6768ef458e98f00575";

// 🌍 Load all countries
async function loadCountries() {
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries');
    const json = await res.json();
    json.data.forEach(c => {
      const option = document.createElement('option');
      option.value = c.country;
      option.textContent = c.country;
      countrySelect.appendChild(option);
    });
  } catch (e) {
    console.error('Error loading countries:', e);
  }
}

// 🏙 Load cities based on selected country
countrySelect.addEventListener('change', async () => {
  const country = countrySelect.value;
  citySelect.innerHTML = '<option value="">--Choose City--</option>';
  citySelect.disabled = true;
  getWeatherBtn.disabled = true;

  if (!country) return;

  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ country })
    });
    const json = await res.json();
    json.data.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
    citySelect.disabled = false;
  } catch (e) {
    console.error('Error loading cities:', e);
  }
});

// 🔘 Enable button on city select
citySelect.addEventListener('change', () => {
  getWeatherBtn.disabled = !citySelect.value;
});

// 🌦 Fetch weather
getWeatherBtn.addEventListener('click', async () => {
  const city = citySelect.value;
  output.textContent = '⏳ Loading weather...';
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const json = await res.json();
    if (json.cod !== 200) throw new Error(json.message);

    const icon = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
    const weather = json.weather[0].main.toLowerCase();
    const localTime = new Date((json.dt + json.timezone) * 1000)
      .toUTCString()
      .replace("GMT", ""); // simple UTC-based city time

    changeBackground(weather);

    output.innerHTML = `
      <h3>${json.name}, ${json.sys.country}</h3>
      <p><strong>${localTime}</strong></p>
      <p>🌡 ${json.main.temp}°C • ${json.weather[0].description}</p>
      <img src="${icon}" class="weather-icon" alt="weather icon">
    `;
  } catch (e) {
    output.textContent = `❌ ${e.message}`;
  }
});

// 🎨 Weather-based background
function changeBackground(weather) {
  const body = document.body;
  if (weather.includes("clear")) body.style.background = "#fef9c3";
  else if (weather.includes("cloud")) body.style.background = "#cbd5e1";
  else if (weather.includes("rain")) body.style.background = "#9ca3af";
  else if (weather.includes("snow")) body.style.background = "#e0f2fe";
  else body.style.background = "#f0f4f8";
}

// 🌗 Toggle dark mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Initialize on load
loadCountries();
