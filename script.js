let clickCount = 0;

const countryInput = document.getElementById("country");
const countriesDatalist = document.getElementById("countries");
const countryCodeSelect = document.getElementById("countryCode");
const myForm = document.getElementById("form");
const modal = document.getElementById("form-feedback-modal");
const clicksInfo = document.getElementById("click-count");

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
            throw new Error("Błąd pobierania danych");
        }
        const data = await response.json();
        const countries = data.map((country) => country.name.common).sort();
        countriesDatalist.innerHTML = countries
            .map((country) => `<option value="${country}">`)
            .join("");
    } catch (error) {
        console.error("Wystąpił błąd:", error);
    }
}

function getCountryByIP() {
    fetch("https://get.geojs.io/v1/ip/geo.json")
        .then((response) => response.json())
        .then((data) => {
            const detectedCountry = data.country;
            countryInput.value = detectedCountry;
            getCountryCode(detectedCountry);
        })
        .catch((error) => {
            console.error("Błąd pobierania danych z serwera GeoJS:", error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Błąd pobierania danych");
            }
            return response.json();
        })
        .then((data) => {
            const countryData = data[0];
            const code =
                countryData.idd.root +
                (countryData.idd.suffixes ? countryData.idd.suffixes[0] : "");
            for (let option of countryCodeSelect.options) {
                if (option.value === code) {
                    option.selected = true;
                    return;
                }
            }
        })
        .catch((error) => {
            console.error("Wystąpił błąd:", error);
        });
}

myForm.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (event.target.tagName !== "TEXTAREA") {
            event.preventDefault();
            myForm.requestSubmit();
        }
    }
});

myForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clicksInfo.innerText = clickCount;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
});

(() => {
    document.addEventListener("click", handleClick);
    fetchAndFillCountries();
    getCountryByIP();
})();

