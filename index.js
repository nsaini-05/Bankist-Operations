document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("login-form", "Teri");
  window.location.href = "layout.html";
});
