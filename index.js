//Select DOM Elements
const userNameField = document.querySelector(".username");
const passwordField = document.querySelector(".password");
const errorMessage = document.querySelector(".error");

const getloggedInUser = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    window.location.href = "/layout.html";
  }
};

getloggedInUser();

const account1 = {
  owner: "Jonas Schmedtmann",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = JSON.parse(localStorage.getItem("accounts")) || [
  account1,
  account2,
  account3,
  account4,
];
/* GET USERNAMES */
const computeUserNames = (accounts) => {
  for (const account of accounts) {
    account.userName = account.owner
      .toLowerCase()
      .split(" ")
      .map((str) => str[0])
      .join("");
  }
};
computeUserNames(accounts);

/* DISPLAY ERROR */

const displayError = (message) => {
  errorMessage.textContent = message;
  setTimeout(() => (errorMessage.textContent = ""), 1000);
};

/* LOGIN FUNCTION */

const userLogin = (userName, password) => {
  const userFound = accounts.find((account) => account.userName === userName);
  if (userFound) {
    if (password !== userFound.pin) {
      displayError("Invalid Username or Password");
    } else {
      //userFound["pin"] = "****";
      localStorage.setItem("loggedInUser", JSON.stringify(userFound));
      localStorage.setItem("accounts", JSON.stringify(accounts));
      window.location.href = "/layout.html";
    }
  } else {
    displayError("Invalid Username or Password");
  }
};

document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  userLogin(userNameField.value, Number(passwordField.value));
});
