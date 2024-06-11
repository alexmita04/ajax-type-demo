const cardContainer = document.querySelector(".card-container");
const input = document.querySelector("input");

const endpoint =
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";

async function fetchData() {
  try {
    const res = await fetch(endpoint);
    const cities = await res.json();
    return cities;
  } catch (err) {
    console.log(err);
  }
}

function queryCities(query, cities) {
  const resCities = [];
  resCities.push(
    ...cities.filter(
      (city) =>
        city.city.toLowerCase().includes(query.toLowerCase()) ||
        city.state.toLowerCase().includes(query.toLowerCase())
    )
  );
  return resCities;
}

function highlightResult(str, query) {
  const regex = new RegExp(query, "gi");
  return str.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );
}

function formatPopulation(pop) {
  const population = pop.split("");
  let counter = 0;
  for (let i = population.length; i >= 0; i--) {
    if (counter % 3 === 0 && counter !== 0 && i !== 0)
      population.splice(i, 0, ",");
    counter++;
  }

  return population.join("");
}

async function printResults(e) {
  const query = e.target.value || "";
  cardContainer.innerHTML = "";
  if (!query) return;

  const cities = await fetchData();
  const filteredCities = queryCities(query, cities);

  filteredCities.forEach((city) => {
    const cityEl = document.createElement("div");
    cityEl.classList.add("card");
    cityEl.innerHTML = `
        <div class="city-state">${highlightResult(
          city.city,
          query
        )}, ${highlightResult(city.state, query)}</div>
        <div class="population">${formatPopulation(city.population)}</div>
          `;
    cardContainer.append(cityEl);
  });
}

input.addEventListener("input", printResults);
