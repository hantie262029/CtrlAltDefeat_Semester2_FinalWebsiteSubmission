// Import from Firebase
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import {auth} from "./firebase-config.js";

// Get all the needed HTML elements/Variable set up
let authForm = document.getElementById("auth-form");
let formTitle = document.getElementById("form-title");
let formWelcome = document.getElementById("form-welcome");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");
let submitButton = document.getElementById("submit-button");
let messageText = document.getElementById("message-text");
let switchtext = document.getElementById("switch-text");
let switchLink = document.getElementById("switch-link");
let rememberCheckbox = document.getElementById("remember-checkbox");

// Logout button
let logoutButton = document.getElementById("logout-button");

// Keep track of which mode the form is in
// false; Log In mode, true; Sign Up mode
let isSignUpMode = false;

//login page functions
function showMessage(messageContent, messageType) {
    messageText.textContent = messageContent;
    messageText.className = messageType;
}

// Switch between Log In/Sign Up
function switchMode() {
    if (isSignUpMode === false) {
        isSignUpMode = true;
        formWelcome.textContent = "Welcome Back!";
        formTitle.textContent = "Sign Up";
        submitButton.textContent = "Create Account";
        switchtext.textContent = "Already have an account?";
        switchLink.textContent = "Sign In";
    } else {
        isSignUpMode = false;
        formWelcome.textContent = "Welcome!";
        formTitle.textContent = "Sign In";
        submitButton.textContent = "Sign In";
        switchtext.textContent = "Don't have an account yet?";
        switchLink.textContent = "Sign Up";
    }
    showMessage("", "");
}

function getFriendlyErrorMessage(errorCode) {
    let friendlyMessage = "Something went wrong. Please try again.";

    if (errorCode === "auth/invalid-credential") {
        friendlyMessage = "Incorrect email or password.";
    } else if (errorCode === "auth/email-already-in-use") {
        friendlyMessage = "An account with this password already exists.";
    } else if (errorCode === "auth/weak-password") {
        friendlyMessage = "Password must be at least 6 characters long.";
    } else if (errorCode === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address";
    } else if (errorCode === "auth/too-many-requests") {
        friendlyMessage = "Too many attempts. Please wait a moment and then try again.";
    }

    return friendlyMessage;
}

async function handleSignUp(userEmail, userPassword) {
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
        .then(function (userCredential) {
            console.log("New Account created for: " + userCredential.user.email);

            signOut(auth).then(function () {
                switchMode();
                passwordInput.value = "";
                showMessage("Account created! Please Log In", "success");
            });
        })
        .catch(function (error) {
            console.log("Sign up Error: " + error.code);
            let friendlyMessage = getFriendlyErrorMessage(error.code);
            showMessage(friendlyMessage, "error");
        });
}

async function handleLogin(userEmail, userPassword) {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
        .then(function (userCredential) {
            console.log("Logged in as: " + userCredential.user.email);

            // Save BEFORE page change
            rememberEmail(userEmail);

            window.location.href = "pages/home.html";
        })
        .catch(function (error) {
            console.log("Log in Error: " + error.code);
            let friendlyMessage = getFriendlyErrorMessage(error.code);
            showMessage(friendlyMessage, "error");
        });
}

// Remember Email
function rememberEmail(userEmail) {
    if (rememberCheckbox.checked === true) {
        localStorage.setItem("savedEmail", userEmail);
    } else {
        localStorage.removeItem("savedEmail");
    }
}

function loadSavedEmail() {
    let savedEmail = localStorage.getItem("savedEmail");

    if (savedEmail !== null) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    let userEmail = emailInput.value;
    let userPassword = passwordInput.value;

    if (isSignUpMode === true) {
        handleSignUp(userEmail, userPassword);
    } else {
        handleLogin(userEmail, userPassword);
    }
}

function handleSwitchClick(event) {
    event.preventDefault();
    switchMode();
}

async function handleLogout() {
    signOut(auth)
        .then(function () {
            console.log("Logged out");

            window.location.href = "index.html";
        })
        .catch(function (error) {
            console.log("logout error: " + error.code);
            alert("Could not log out. Please try again");
        });
}

if (authForm !== null) {
    authForm.addEventListener("submit", handleFormSubmit);
    switchLink.addEventListener("click", handleSwitchClick);
    // Remember email
    loadSavedEmail();
}

if (logoutButton !== null) {
    logoutButton.addEventListener("click", handleLogout);
}
