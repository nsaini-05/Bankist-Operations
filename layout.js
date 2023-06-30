"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
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

const transactions = [200, 450, -400, 3000, -650, -130, 70, 1300];

const accounts = [account1, account2, account3, account4];

const transactionsSection = document.querySelector(".transactions");

const displayTransactions = (transactions) => {
  //Clearing the exisiting
  transactionsSection.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const transactionType = transaction < 0 ? "Withdraw" : "Deposit";
    const htmlElement = `<div class="transaction-record">
        <p class="date">12/03/2020</p>
        <p class="tag ${transactionType}-tag">${
      index + 1
    } ${transactionType}</p>
        <p class="transaction-amount">${transaction}&nbsp;$</p>
      </div>`;
    transactionsSection.insertAdjacentHTML("afterbegin", htmlElement);
  });
};

displayTransactions(transactions);
