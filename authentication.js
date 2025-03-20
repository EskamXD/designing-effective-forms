// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDcCBF6Ye--ft8_D3rOEgo6nreFulhTMr0",
    authDomain: "studia-19d70.firebaseapp.com",
    projectId: "studia-19d70",
    storageBucket: "studia-19d70.firebasestorage.app",
    messagingSenderId: "766813103038",
    appId: "1:766813103038:web:4005a57c977090d34bcfef",
    measurementId: "G-LT7CBBGH43",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Pobranie przycisków logowania/wylogowania
const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

// Pobranie pól formularza, do których chcemy wstrzyknąć dane użytkownika
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");

// Funkcja logowania
const userSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Zalogowany użytkownik:", user);

        // Jeśli obiekt user.displayName zawiera pełne imię i nazwisko, rozdzielamy go na części
        if (user.displayName) {
            const names = user.displayName.split(" ");
            firstNameInput.value = names[0] || "";
            // Pozostałe części traktujemy jako nazwisko (może być więcej niż jedno słowo)
            lastNameInput.value = names.slice(1).join(" ") || "";
        }
        // Ustawiamy email – jest to wartość zwracana przez Firebase
        emailInput.value = user.email;

        // alert("Jesteś zalogowany przez Google!");
    } catch (error) {
        console.error("Błąd logowania:", error);
        alert("Wystąpił problem podczas logowania. Spróbuj ponownie.");
    }
};

// Funkcja wylogowania
const userSignOut = async () => {
    try {
        await signOut(auth);
        // alert("Wylogowano!");
        // Opcjonalnie – czyścimy pola formularza
        firstNameInput.value = "";
        lastNameInput.value = "";
        emailInput.value = "";
    } catch (error) {
        console.error("Błąd wylogowania:", error);
        alert("Wystąpił problem podczas wylogowania. Spróbuj ponownie.");
    }
};

// Monitorowanie zmian stanu autentykacji
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Autoryzowany użytkownik:", user);
        // W razie potrzeby aktualizujemy dane formularza (może zdarzyć się, że użytkownik już jest zalogowany)
        if (user.displayName) {
            const names = user.displayName.split(" ");
            firstNameInput.value = names[0] || "";
            lastNameInput.value = names.slice(1).join(" ") || "";
        }
        emailInput.value = user.email;
    }
});

// Podpięcie zdarzeń do przycisków
if (signInButton) {
    signInButton.addEventListener("click", userSignIn);
}
if (signOutButton) {
    signOutButton.addEventListener("click", userSignOut);
}

