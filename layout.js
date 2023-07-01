"use strict";
/* DOM ELEMENTS */
const transactionsSection = document.querySelector(".transactions");
const balanceAmount = document.querySelector(".balance-amount");
const depositTotalCard = document.querySelector(".deposit-total-card");
const withdrawTotalCard = document.querySelector(".withdraw-total-card");
const interestTotalCard = document.querySelector(".interest-total-card");
const currentUserLabel = document.querySelector(".username-label");
const logOutButton = document.querySelector(".logout-btn");
let currentUser;

const getloggedInUser = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    currentUser = JSON.parse(loggedInUser);
  } else {
    window.location.href = "/";
  }
};

getloggedInUser();

/* LOGOUT USER FUNCTION */
const logOutUser = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "/";
};

logOutButton.addEventListener("click", logOutUser);

/* Data */
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

const accounts = [account1, account2, account3, account4];

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

/* DISPLAY TRANSACTIONS */
const displayTransactions = (transactions) => {
  transactionsSection.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const transactionType = transaction < 0 ? "Withdraw" : "Deposit";
    const htmlElement = `<div class="transaction-record">
        <p class="date">12/03/2020</p>
        <p class="tag ${transactionType}-tag">${
      index + 1
    } ${transactionType}</p>
        <p class="transaction-amount">${transaction.toFixed(2)}&nbsp;$</p>
      </div>`;
    transactionsSection.insertAdjacentHTML("afterbegin", htmlElement);
  });
};

/* DISPLAY SUMMARY */
const displaySummary = (transactions) => {
  const depositTotal = transactions
    .filter((transaction) => transaction > 0)
    .reduce((bal, curr, index) => bal + curr, 0);
  depositTotalCard.textContent = `${depositTotal.toFixed(2)} $`;

  const withdrawTotal = transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, curr, index) => acc + curr, 0);
  withdrawTotalCard.textContent = `${Math.abs(withdrawTotal).toFixed(2)} $`;

  const interestTotal = transactions
    .filter((transaction) => transaction > 0)
    .map(
      (transaction, i, array) => (transaction * currentUser.interestRate) / 100
    )
    .filter((interest) => interest > 1)
    .reduce((acc, int, index, array) => acc + int, 0);
  interestTotalCard.textContent = `${interestTotal.toFixed(2)} $`;
};

/* DISPLAY BALANCE */
const displayBalance = (transactions) => {
  const balance = transactions.reduce((acc, cur) => acc + cur, 0);
  balanceAmount.innerHTML = balance.toFixed(2) + "&nbsp$";
};

const loadInitialData = () => {
  const { owner: userName, transactions } = currentUser;
  displayTransactions(transactions);
  displaySummary(transactions);
  displayBalance(transactions);
  currentUserLabel.textContent = userName.split(" ")[0];
};

loadInitialData();

// /* GET DEPOSITS */
// const deposits = transactions.filter((transaction) => transaction > 0);

// /* GET DEPOSITS */
// const withDraws = transactions.filter((transaction) => transaction < 0);

// /* CALCULATE MAXIMUM TRANSACTION AMOUNT */
// const computeMaximumTransaction = (transactions) => {
//   const maxValue = transactions.reduce(
//     (acc, curr) => (acc = curr < acc ? acc : curr),
//     0
//   );
// };
// computeMaximumTransaction(transactions);

// /* CALCULATE AVERAGE TRANSACTION AMOUNT */
// const getAvgWithDraw = (withDraws) => {
//   const avgWithDraw = withDraws.reduce((acc, cur, i, array) => {
//     return acc + cur / array.length;
//   }, 0);
//   return Math.abs(avgWithDraw).toFixed(2);
// };
