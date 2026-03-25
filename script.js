// Firebase SDK
const firebaseScriptApp = document.createElement('script');
firebaseScriptApp.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
document.head.appendChild(firebaseScriptApp);

const firebaseScriptDb = document.createElement('script');
firebaseScriptDb.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js";
document.head.appendChild(firebaseScriptDb);

firebaseScriptDb.onload = () => {
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBEwB4Wj2tGZDs1bjI0uxRuVleF_tTTMBc",
    authDomain: "godstimetournament.firebaseapp.com",
    databaseURL: "https://godstimetournament-default-rtdb.firebaseio.com",
    projectId: "godstimetournament",
    storageBucket: "godstimetournament.appspot.com",
    messagingSenderId: "50330020920",
    appId: "1:50330020920:web:7697029e8848f5127d8acd"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // Countries
  const countries = [
    {name: "Nigeria", code: "+234"},
    {name: "South Africa", code: "+27"},
    {name: "Uganda", code: "+256"},
    {name: "Tanzania", code: "+255"},
    {name: "Kenya", code: "+254"},
    {name: "Ghana", code: "+233"}
  ];

  const countrySelect = document.getElementById("country");
  countries.forEach(c => {
    let opt = document.createElement("option");
    opt.value = c.code;
    opt.textContent = c.name;
    countrySelect.appendChild(opt);
  });

  countrySelect.addEventListener("change", () => {
    document.getElementById("phone").value = countrySelect.value;
  });

  // Show sections
  function showSection(id){
    document.getElementById("registration").style.display = "none";
    document.getElementById("admin").style.display = "none";
    document.getElementById(id).style.display = "block";
    if(id==="admin"){ loadRegistrations(); }
  }

  // Admin login
  function adminLogin(){
    let username = prompt("Enter Admin Username:");
    let password = prompt("Enter Admin Password:");
    if(username==="GT0021" && password==="Godstime@1"){
      showSection("admin");
    } else { alert("Wrong credentials"); }
  }

  // Registration submit
  document.getElementById("regForm").addEventListener("submit", function(e){
    e.preventDefault();
    const reg = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      country: countrySelect.options[countrySelect.selectedIndex].text,
      phone: document.getElementById("phone").value,
      team: document.getElementById("team").value,
      game: document.getElementById("game").value,
      date: new Date().toLocaleString()
    };
    db.ref("registrations").push(reg);
    alert("Registration successful!");
    this.reset();
  });

  // Load registrations
  function loadRegistrations(){
    const tbody = document.querySelector("#regTable tbody");
    tbody.innerHTML = "";
    db.ref("registrations").on("value", snapshot=>{
      tbody.innerHTML = "";
      snapshot.forEach(child=>{
        const r = child.val();
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${r.name}</td><td>${r.email}</td><td>${r.country}</td><td>${r.phone}</td><td>${r.team}</td><td>${r.game}</td><td>${r.date}</td>`;
        tbody.appendChild(tr);
      });
    });
  }

  // Clear all registrations
  document.getElementById("clearBtn").addEventListener("click", ()=>{
    if(confirm("Are you sure? This will delete all registrations.")){
      db.ref("registrations").remove();
    }
  });

  // Button events
  document.getElementById("regBtn").addEventListener("click", ()=>showSection("registration"));
  document.getElementById("adminBtn").addEventListener("click", ()=>adminLogin());

  // Show registration form by default
  showSection("registration");
};
