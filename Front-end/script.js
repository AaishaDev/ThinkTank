const signup = document.getElementById("signup-content");
const login = document.getElementById("login-content");
const loginSection = document.getElementById("login-section");
const notify = document.getElementById('notify')


// Login button click triggered
document.getElementById("login-button").addEventListener("click", () => {
  loginSection.style.display = "flex";
  signup.style.display = "none";
  login.style.display = "block";
});

// Sign Up button click triggered
document.getElementById("sign-up-button").addEventListener("click", () => {
  loginSection.style.display = "block";
  signup.style.display = "block";
  login.style.display = "none";
});

// Get Started button click triggered
document.getElementById("get-started").addEventListener("click", () => {
  loginSection.style.display = "block";
  signup.style.display = "block";
  login.style.display = "none";
});

// Login /  Signup form toggle
document.getElementById("login-link").addEventListener("click", () => {
  signup.style.display = "block";
  login.style.display = "none";
});
document.getElementById("sign-up-link").addEventListener("click", () => {
  signup.style.display = "none";
  login.style.display = "block";
});

// Login Control
async function loginControl(e) {
  e.target.innerHTML = `<span class="progress material-symbols-outlined">
  magic_exchange
  </span>`
  const usernameInput = login.querySelector('input[name="username"]');
  const passwordInput = login.querySelector('input[name="password"]');
  if(!usernameInput.value || !passwordInput.value) {
    notify.innerHTML = 'Username and Password required!'
    notify.style.display ="block"
    e.target.innerHTML = 'Login';
    setTimeout(()=>{
      notify.style.display ="none"
    },3000)
    return
  }
  

  await loginRequest({
    username: usernameInput.value,
    password: passwordInput.value,
  }, e);

  // clear the fields
  usernameInput.value = "";
  passwordInput.value = "";
}

// SignUp Control
async function signUpControl(e) {
  e.target.innerHTML = `<span class="progress material-symbols-outlined">
  magic_exchange
  </span>`
  const usernameInput = signup.querySelector('input[name="username"]');
  const passwordInput = signup.querySelector('input[name="password"]');

  if(!usernameInput.value || !passwordInput.value) {
    notify.innerHTML = 'Username and Password required!'
    notify.style.display ="block"
    e.target.innerHTML = 'Sign Up';
    setTimeout(()=>{
      notify.style.display ="none"
    },3000)
    return
  }

  await signUpRequest({
    username: usernameInput.value,
    password: passwordInput.value,
  }, e);
  // clear the fields
  usernameInput.value = "";
  passwordInput.value = "";
}

// Click out event triggered
document.getElementById("login-section").addEventListener("click", (event) => {
  const targetElement = document.getElementsByClassName("login");
  if (!targetElement[0].contains(event.target)) {
    loginSection.style.display = "none";
  }
});

// SignUp Request to backend
async function signUpRequest(data) {
  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      credentials :"include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (resData.success) {
      loginRequest(data);
    }
  
  } catch (error) {
  
  }
}
// Login Request to backend
async function loginRequest(data, e) {

  try {
    const res = await fetch("http://localhost:5000/auth", {
      method: "POST",
      credentials :"include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (resData.access_token) {
      const jwt = resData.access_token;
      const refresh_token = resData.refresh_token;
      localStorage.setItem("access_token", jwt);
      localStorage.setItem("refresh_token", refresh_token);
      
      window.location.href = "./dashboard.html";
      e.target.innerHTML = 'Login';
      return
    }
    else{
      notify.innerHTML = 'Wrong Credentials!!'
    notify.style.display ="block"
    e.target.innerHTML = 'Login';
    setTimeout(()=>{
      notify.style.display ="none"
    },3000)

    return
    }
    
  } catch (error) {
   
    e.target.innerHTML = 'Login';
  }
}




