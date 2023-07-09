"use strict";
/* DOM ELEMENTS */
const transactionsSection = document.querySelector(".transactions");
const balanceAmount = document.querySelector(".balance-amount");
const depositTotalCard = document.querySelector(".deposit-total-card");
const withdrawTotalCard = document.querySelector(".withdraw-total-card");
const interestTotalCard = document.querySelector(".interest-total-card");
const currentUserLabel = document.querySelector(".username-label");
const logOutButton = document.querySelector(".logout-btn");
const avgWithdraw = document.querySelector(".avg-withdraw");
const avgDeposit = document.querySelector(".avg-deposit");
const maxWithDraw = document.querySelector(".max-withdraw");
const transferButton = document.querySelector(".btn-transfer");
const transferDialog = document.querySelector(".transfer-dialog");
const overlayContainer = document.querySelector(".overlay-container");
const requestButton = document.querySelector(".btn-request");
const requestDialog = document.querySelector(".request-dialog");
const closeAccountButton = document.querySelector(".btn-close");
const closeDialog = document.querySelector(".close-dialog");
const closeDialogButton = document.querySelectorAll(".cls-btn");
const errorMessage = document.querySelectorAll(".error");
/*Action  buttons */
const transferDialogButton = document.querySelector(".btn-transfer-dialog");
const transferUserNameField = document.querySelector(".transfer-username");
const transferAmountField = document.querySelector(".transfer-amount");
const transferForm = document.querySelector(".transfer-form");

const closeDialogUserName = document.querySelector(".closeUsername");
const closeDiaologPassword = document.querySelector(".closePassword");
const closeForm = document.querySelector(".close-form");

const requestAmountField = document.querySelector(".request-amount");
const requestMoneyForm = document.querySelector(".request-form");
let currentUser;

/* LOGOUT USER FUNCTION */
const logOutUser = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "/";
};

logOutButton.addEventListener("click", logOutUser);

/* Data */
// const account1 = {
//   owner: "Jonas Schmedtmann",
//   transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   transactions: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   transactions: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];
let accounts = [];
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

/* DISPLAY BALANCE */
const displayBalance = (transactions) => {
  const balance = transactions.reduce((acc, cur) => acc + cur, 0);
  currentUser.currentBalance = balance.toFixed(2);
  balanceAmount.innerHTML = balance.toFixed(2) + "&nbsp$";
};

const calculateStats = (transactions) => {
  const avgWithdrawl = transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, curr, index, array) => {
      return acc + curr / array.length;
    }, 0)
    .toFixed(2);
  avgWithdraw.textContent = Math.abs(avgWithdrawl) + " $";

  const avgDepositAmount = currentUser?.transactions
    .filter((transaction) => transaction > 0)
    .reduce((acc, curr, index, array) => {
      return acc + curr / array.length;
    }, 0)
    .toFixed(2);
  avgDeposit.textContent = Math.abs(avgDepositAmount) + " $";

  const maxWithDrawl = currentUser?.transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, curr) => {
      return curr < acc ? curr : acc;
    }, 0)
    .toFixed(2);
  maxWithDraw.textContent = Math.abs(maxWithDrawl) + "$";
};

const loadInitialData = (currentUser) => {
  const { owner: userName, transactions } = currentUser;
  displayTransactions(transactions);
  displaySummary(transactions);
  displayBalance(transactions);
  currentUserLabel.textContent = userName.split(" ")[0];
  calculateStats(transactions);
};

const getloggedInUser = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  accounts = JSON.parse(localStorage.getItem("accounts"));
  if (loggedInUser) {
    currentUser = JSON.parse(loggedInUser);
    const currentUser1 = accounts.find(
      (acc) => acc.userName === currentUser.userName
    );
    loadInitialData(currentUser);
  } else {
    window.location.href = "/";
  }
};

getloggedInUser();

/*Trigger Operations Button */

const hideOverlayContainer = () => {
  overlayContainer.classList.toggle("hide");
};

transferButton.addEventListener("click", () => {
  hideOverlayContainer();
  transferDialog.classList.remove("hide");
});

requestButton.addEventListener("click", () => {
  hideOverlayContainer();
  requestDialog.classList.remove("hide");
});

closeAccountButton.addEventListener("click", () => {
  hideOverlayContainer();
  closeDialog.classList.remove("hide");
});

const closeDialogFunction = () => {
  if (!closeDialog.classList.contains("hide")) {
    closeDialog.classList.add("hide");
  }
  if (!transferDialog.classList.contains("hide")) {
    transferDialog.classList.add("hide");
  }
  if (!requestDialog.classList.contains("hide")) {
    requestDialog.classList.add("hide");
  }
  overlayContainer.classList.toggle("hide");
};

closeDialogButton.forEach((button) =>
  button.addEventListener("click", () => {
    closeDialogFunction();
  })
);

const displayError = (message, type) => {
  let selected;
  switch (type) {
    case "transfer":
      selected = errorMessage[0];
      break;
    case "request":
      selected = errorMessage[1];
      break;
    case "close":
      selected = errorMessage[2];
      break;
  }
  selected.textContent = message;
  setTimeout(() => (selected.innerHTML = "&nbsp;"), 1000);
};

const resetTransferForm = () => {
  transferUserNameField.value = "";
  transferAmountField.value = "";
};

const resetCloseForm = () => {
  closeDialogUserName.value = "";
  closeDiaologPassword.value = "";
};

/*Transfer Operations */
const initiateTransfer = () => {
  const recieverNameInput = transferUserNameField.value;
  const transferAmount = Number(transferAmountField.value);
  const reciever = accounts.find((acc) => acc.userName === recieverNameInput);
  if (reciever && reciever.userName !== currentUser.userName) {
    if (transferAmount < currentUser.currentBalance) {
      currentUser.transactions.push(transferAmount * -1);
      reciever.transactions.push(transferAmount);
      updateLocalStoreAccounts(accounts);
      updateloggedInUser(currentUser);
      resetTransferForm();
      closeDialogFunction();
      loadInitialData(currentUser);
    } else {
      displayError("Insufficient Balance", "transfer");
    }
  } else {
    reciever && reciever.userName === currentUser.userName
      ? displayError("Sender and Reciever Cannot be same", "transfer")
      : displayError("No Such User Found", "transfer");
  }
};
transferForm.addEventListener("submit", (e) => {
  e.preventDefault();
  initiateTransfer();
});

const initiateAccountClosure = () => {
  const userName = closeDialogUserName.value;
  const userPassword = Number(closeDiaologPassword.value);
  if (userName === currentUser.userName && userPassword === currentUser.pin) {
    const indexofCurrent = accounts.findIndex(
      (acc) => acc.userName === currentUser.userName
    );
    accounts.splice(indexofCurrent, 1);
    updateLocalStoreAccounts(accounts);
    logOutUser();
  } else {
    displayError("Invalid Credentials", "close");
  }
};

closeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  initiateAccountClosure();
});

/*Deposit */
const initiateDeposit = (amount) => {
  const isEligible = currentUser.transactions.some(
    (transaction) => transaction > 0.1 * amount
  );
  if (isEligible) {
    setTimeout(() => {
      currentUser.transactions.push(amount);
      updateloggedInUser(JSON.stringify(currentUser));
      loadInitialData(currentUser);
    }, 2000);
    closeDialogFunction();
  } else {
    displayError("Do Not Qualify for Request", "request");
  }
};
requestMoneyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const requestAmount = Number(requestAmountField.value);
  initiateDeposit(requestAmount);
});

const updateLocalStoreAccounts = (accounts) => {
  const findCurrentUserIndex = accounts.findIndex(
    (account) => account.userName === currentUser.userName
  );
  if (findCurrentUserIndex !== -1) {
    accounts[findCurrentUserIndex] = currentUser;
  }
  localStorage.setItem("accounts", JSON.stringify(accounts));
};

const updateloggedInUser = (currentUser) => {
  localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
};
