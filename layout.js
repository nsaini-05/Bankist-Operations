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
const sortIcon = document.querySelector(".sort-icon");
let isSorted = false;
let currentUser;
const currentDate = document.querySelector(".date");
const mins = document.querySelector(".mins");
const seconds = document.querySelector(".seconds");

let accounts = [];
let timer;

/* LOGOUT USER FUNCTION */
const logOutUser = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "/";
};

logOutButton.addEventListener("click", logOutUser);

/* DISPLAY SUMMARY */
const displaySummary = (transactions) => {
  const depositTotal = transactions
    .filter((transaction) => transaction > 0)
    .reduce((bal, curr, index) => bal + curr, 0);
  depositTotalCard.textContent = `${formatCurrency(
    currentUser.currency,
    currentUser.locale,
    depositTotal.toFixed(2)
  )}`;

  const withdrawTotal = transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, curr, index) => acc + curr, 0);
  withdrawTotalCard.textContent = `${formatCurrency(
    currentUser.currency,
    currentUser.locale,
    Math.abs(withdrawTotal).toFixed(2)
  )}`;

  const interestTotal = transactions
    .filter((transaction) => transaction > 0)
    .map(
      (transaction, i, array) => (transaction * currentUser.interestRate) / 100
    )
    .filter((interest) => interest > 1)
    .reduce((acc, int, index, array) => acc + int, 0);
  interestTotalCard.textContent = `${formatCurrency(
    currentUser.currency,
    currentUser.locale,
    interestTotal.toFixed(2)
  )}`;
};

/* DISPLAY TRANSACTIONS */
const displayTransactions = (currentUser, sort = false) => {
  const movs = sort
    ? currentUser.transactions.slice().sort((a, b) => a - b)
    : currentUser.transactions;
  const movsdate = sort
    ? currentUser.movementsDates
        .slice()
        .sort((a, b) => Number(new Date(b)) - Number(new Date(a)))
    : currentUser.movementsDates;
  transactionsSection.innerHTML = "";
  movs.forEach((transaction, index) => {
    const transactionType = transaction < 0 ? "Withdraw" : "Deposit";
    const htmlElement = `<div class="transaction-record">
        <p class="date">${formattingDate(movsdate[index])}</p>
        <p class="tag ${transactionType}-tag">${
      index + 1
    } ${transactionType}</p>
        <p class="transaction-amount">${formatCurrency(
          currentUser.currency,
          currentUser.locale,
          transaction.toFixed(2)
        )}</p>
      </div>`;
    transactionsSection.insertAdjacentHTML("afterbegin", htmlElement);
  });
};

/* DISPLAY BALANCE */
const displayBalance = (transactions) => {
  const balance = transactions.reduce((acc, cur) => acc + cur, 0);
  currentUser.currentBalance = balance.toFixed(2);
  balanceAmount.innerHTML = formatCurrency(
    currentUser.currency,
    currentUser.locale,
    balance.toFixed(2)
  );
};

/* CALCULATE  STATISTICS */
const calculateStats = (transactions) => {
  const avgWithdrawl = transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, curr, index, array) => {
      return acc + curr / array.length;
    }, 0)
    .toFixed(2);
  avgWithdraw.textContent = formatCurrency(
    currentUser.currency,
    currentUser.locale,
    Math.abs(avgWithdrawl)
  );

  const avgDepositAmount = currentUser?.transactions
    .filter((transaction) => transaction > 0)
    .reduce((acc, curr, index, array) => {
      return acc + curr / array.length;
    }, 0)
    .toFixed(2);
  avgDeposit.textContent = formatCurrency(
    currentUser.currency,
    currentUser.locale,
    Math.abs(avgDepositAmount)
  );
  const maxWithDrawl = currentUser?.transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, curr) => {
      return curr < acc ? curr : acc;
    }, 0)
    .toFixed(2);
  maxWithDraw.textContent = formatCurrency(
    currentUser.currency,
    currentUser.locale,
    Math.abs(maxWithDrawl)
  );
};

/* LOAD INITIAL DATA */
const loadInitialData = (currentUser) => {
  const { owner: userName, transactions } = currentUser;
  displayTransactions(currentUser, false);
  displaySummary(transactions);
  displayBalance(transactions);
  currentUserLabel.textContent = userName.split(" ")[0];
  calculateStats(transactions);
  setCurrentDate();
};

/* SET CURRENT DATE */
const setCurrentDate = () => {
  const now = new Date();
  const locale = currentUser.locale;
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };
  const standardDate = new Intl.DateTimeFormat(locale, options).format(now);
  currentDate.textContent = standardDate;
};

/* DISPLAY BALANCE */
const getloggedInUser = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  accounts = JSON.parse(localStorage.getItem("accounts"));
  if (loggedInUser) {
    currentUser = JSON.parse(loggedInUser);
    loadInitialData(currentUser);
    startLogoutTimer();
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

/* CLOSE  DIALOG */
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

/* DISPLAY ERROR FUNCTION */
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
      currentUser.movementsDates.push(new Date().toISOString());
      reciever.movementsDates.push(new Date().toISOString());
      updateLocalStoreAccounts(accounts);
      updateloggedInUser(currentUser);
      resetTransferForm();
      closeDialogFunction();
      loadInitialData(currentUser);
      resetTimer();
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

/* ACCOUNT CLOSURE */
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

/* DEPOSIT OPERATION  */
const initiateDeposit = (amount) => {
  const isEligible = currentUser.transactions.some(
    (transaction) => transaction > 0.1 * amount
  );
  if (isEligible) {
    setTimeout(() => {
      currentUser.transactions.push(amount);
      currentUser.movementsDates.push(new Date());
      updateloggedInUser(currentUser);
      updateLocalStoreAccounts(accounts);
      loadInitialData(currentUser);
    }, 2000);
    closeDialogFunction();
    resetTimer();
  } else {
    displayError("Do Not Qualify for Request", "request");
  }
};
requestMoneyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const requestAmount = Number(requestAmountField.value);
  initiateDeposit(requestAmount);
});

/* UPDATE STORAGE */
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

/* EXTRA METHODS */
const allAccountTransactions = accounts
  .map((account) => account.transactions)
  .flat();
const overallBalance = allAccountTransactions.reduce((acc, curr) => acc + curr);

sortIcon.addEventListener("click", () => {
  if (isSorted === false) {
    displayTransactions(currentUser, true);
    isSorted = true;
  } else {
    displayTransactions(currentUser, false);
    isSorted = false;
  }
});

const totalCashAvaiable = accounts.flatMap((account) => account.transactions);

/* FORMAT TIME */
function formattingDate(inputDate) {
  let dayPassed = Math.abs(new Date() - new Date(inputDate));
  dayPassed = Math.round(dayPassed / (1000 * 3600 * 24));
  if (dayPassed === 0) return "Today";
  if (dayPassed === 1) return "Yesterday";
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    /* INTERNATIONAL CONVERSION TO TIME */
    let date = new Date(inputDate);
    return new Intl.DateTimeFormat(currentUser.locale).format(date);
  }
}

/* FORMAT CURRENCY */
function formatCurrency(currency, locale, amount) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/* LOGOUT  TIMER */
function startLogoutTimer() {
  let timerSeconds = 300;
  const tick = () => {
    if (timerSeconds <= 0) {
      clearInterval(timer);
      logOutUser();
    }
    const [minutes, secondsElapse] = [
      Math.trunc(timerSeconds / 60)
        .toString()
        .padStart(2, "0"),
      Math.trunc(timerSeconds % 60)
        .toString()
        .padStart(2, "0"),
    ];
    mins.textContent = minutes;
    seconds.textContent = secondsElapse;
    timerSeconds = timerSeconds - 1;
  };
  tick();
  timer = setInterval(tick, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startLogoutTimer();
}
