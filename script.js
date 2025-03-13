// ------------------------
// GLOBALNE DECLARACJE
// ------------------------
let clickCount = 0;

const myForm = document.getElementById("form");
const modal = document.getElementById("form-feedback-modal");
const clicksInfo = document.getElementById("click-count");

// Pola związane z lokalizacją
const countryInput = document.getElementById("country");
const countriesDatalist = document.getElementById("countries");
const countryCodeSelect = document.getElementById("countryCode");

// Strony formularza
const page1 = document.getElementById("page-1");
const page2 = document.getElementById("page-2");
const page3 = document.getElementById("page-3");
const nextBtn1 = document.getElementById("nextBtn1");
const prevBtn2 = document.getElementById("prevBtn2");
const nextBtn2 = document.getElementById("nextBtn2");
const prevBtn3 = document.getElementById("prevBtn3");

// Checkboxy i pola związane z kontem
const createAccountCheckbox = document.getElementById("createAccount");
const accountFields = document.getElementById("accountFields");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Checkboxy i pola związane z fakturą
const companyInvoiceCheckbox = document.getElementById("companyInvoice");
const invoiceFields = document.getElementById("invoiceFields");
const vatUECheckbox = document.getElementById("vatUE");
const vatNumberInput = document.getElementById("vatNumber");
const invoiceDataTextarea = document.getElementById("invoiceData");

// ------------------------
// FUNKCJE POMOCNICZE
// ------------------------

// Funkcja aktualizująca licznik kliknięć
function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

// Pobranie i wypełnienie listy krajów
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

// Pobranie kraju użytkownika na podstawie adresu IP
function getCountryByIP() {
    fetch("https://get.geojs.io/v1/ip/geo.json")
        .then((response) => response.json())
        .then((data) => {
            console.log("GeoJS data:", data);
            const detectedCountry = data.country;
            countryInput.value = detectedCountry;
            getCountryCode(detectedCountry);
        })
        .catch((error) => {
            console.error("Błąd pobierania danych z serwera GeoJS:", error);
        });
}

// Pobranie kodu kierunkowego na podstawie nazwy kraju
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

// Walidacja hasła na bieżąco – przykładowo sprawdzamy minimalną długość
function validatePasswordField() {
    const minLength = 8;
    if (passwordInput.value.length < minLength) {
        passwordInput.setCustomValidity(
            `Hasło musi mieć co najmniej ${minLength} znaków`
        );
    } else {
        passwordInput.setCustomValidity("");
    }
    // Aktualizacja wyglądu pola
    if (!passwordInput.checkValidity()) {
        passwordInput.classList.remove("is-valid");
        passwordInput.classList.add("is-invalid");
    } else {
        passwordInput.classList.remove("is-invalid");
        passwordInput.classList.add("is-valid");
    }
}

// Funkcja walidująca elementy w obrębie danej strony
function validatePage(page) {
    const inputs = page.querySelectorAll("input, select, textarea");
    page.classList.add("was-validated");
    for (let input of inputs) {
        if (!input.checkValidity()) {
            return false;
        }
    }
    return true;
}

// Walidacja na blur dla wszystkich pól (daje feedback na bieżąco)
const allFields = document.querySelectorAll("input, select, textarea");
allFields.forEach((field) => {
    field.addEventListener("blur", function () {
        if (!this.checkValidity()) {
            this.classList.remove("is-valid");
            this.classList.add("is-invalid");
        } else {
            this.classList.remove("is-invalid");
            this.classList.add("is-valid");
        }
    });
});

// ------------------------
// OBSŁUGA ZDARZEŃ
// ------------------------

// Walidacja hasła przy wpisywaniu
passwordInput.addEventListener("input", validatePasswordField);

// Obsługa Enter (pomijamy TextArea)
myForm.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
        event.preventDefault();
        myForm.requestSubmit();
    }
});

// Obsługa submit – wyświetlenie modala z raportem kliknięć (po walidacji całego formularza)
myForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!myForm.checkValidity()) {
        myForm.classList.add("was-validated");
        return;
    }
    // Dodatkowe sprawdzenie, jeśli konto ma być założone – zgodność haseł
    if (createAccountCheckbox.checked) {
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert("Hasła muszą być takie same!");
            return;
        }
    }
    clicksInfo.innerText = clickCount;
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
});

// Logika paginacji
nextBtn1.addEventListener("click", function () {
    if (validatePage(page1)) {
        page1.style.display = "none";
        page2.style.display = "block";
    }
});

prevBtn2.addEventListener("click", function () {
    page2.style.display = "none";
    page1.style.display = "block";
});

nextBtn2.addEventListener("click", function () {
    if (validatePage(page2)) {
        // Dodatkowa walidacja dla założenia konta – sprawdzamy zgodność haseł, jeśli checkbox jest zaznaczony
        if (
            createAccountCheckbox.checked &&
            passwordInput.value !== confirmPasswordInput.value
        ) {
            alert("Hasła muszą być takie same!");
            return;
        }
        page2.style.display = "none";
        page3.style.display = "block";
    }
});

prevBtn3.addEventListener("click", function () {
    page3.style.display = "none";
    page2.style.display = "block";
});

// Obsługa checkboxa "Chcesz założyć konto?"
createAccountCheckbox.addEventListener("change", function () {
    if (createAccountCheckbox.checked) {
        accountFields.style.display = "block";
        emailInput.disabled = false;
        passwordInput.disabled = false;
        confirmPasswordInput.disabled = false;
        // Ustaw wymagane atrybuty
        emailInput.setAttribute("required", "true");
        passwordInput.setAttribute("required", "true");
        confirmPasswordInput.setAttribute("required", "true");
    } else {
        accountFields.style.display = "none";
        emailInput.disabled = true;
        passwordInput.disabled = true;
        confirmPasswordInput.disabled = true;
        // Usuń wymagane atrybuty
        emailInput.removeAttribute("required");
        passwordInput.removeAttribute("required");
        confirmPasswordInput.removeAttribute("required");
        // Resetuj walidację
        emailInput.setCustomValidity("");
        passwordInput.setCustomValidity("");
        confirmPasswordInput.setCustomValidity("");
    }
});

// Walidacja potwierdzenia hasła na bieżąco
confirmPasswordInput.addEventListener("input", function () {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Hasła muszą być takie same");
    } else {
        confirmPasswordInput.setCustomValidity("");
    }
    // Aktualizacja stylu – dzięki blur listenerowi pola już zmieniają klasy
});

// Obsługa checkboxa "Chcesz fakturę na firmę?"
companyInvoiceCheckbox.addEventListener("change", function () {
    if (companyInvoiceCheckbox.checked) {
        invoiceFields.style.display = "block";
        vatUECheckbox.disabled = false;
        vatNumberInput.disabled = false;
        invoiceDataTextarea.disabled = false;
    } else {
        invoiceFields.style.display = "none";
        vatUECheckbox.disabled = true;
        vatNumberInput.disabled = true;
        invoiceDataTextarea.disabled = true;
    }
});

// ------------------------
// INICJALIZACJA
// ------------------------
(() => {
    document.addEventListener("click", handleClick);
    fetchAndFillCountries();
    getCountryByIP();
})();

