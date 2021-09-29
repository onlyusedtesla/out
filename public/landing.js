(function () {
  
  var placeholder = document.querySelector('.js-tesla-image'),
      small = placeholder.querySelector('.js-tesla-image-small');
  
  // 1: load small image and show it
  var img = new Image();
  img.src = small.src;
  img.onload = function () {
    small.classList.add('loaded');
  };
  
  // 2: load large image
  var imgLarge = new Image();
  imgLarge.src = placeholder.dataset.large; 
  imgLarge.onload = function () {
    imgLarge.classList.add('loaded');
  };
  
  placeholder.appendChild(imgLarge);
  
  function showSuccessMessage() {
    var form = document.querySelector(".js-form"),
        successMessage = document.querySelector(".js-success-message"),
        errorMessage = document.querySelector(".js-error-message");

    form.classList.add('hidden');
    errorMessage.classList.add('hidden');
    successMessage.classList.remove('hidden');
  }

  function showErrorMessage() {
    var errorMessage = document.querySelector(".js-error-message");
    errorMessage.classList.remove('hidden');
  }
  
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCsZEWKLqDecBRpHFjHdStiHc3fFu-p-yM",
    authDomain: "teslatracker-landing-page.firebaseapp.com",
    databaseURL: "https://teslatracker-landing-page-default-rtdb.firebaseio.com",
    projectId: "teslatracker-landing-page",
    storageBucket: "teslatracker-landing-page.appspot.com",
    messagingSenderId: "482735613070",
    appId: "1:482735613070:web:3f211eeaea5cbc0d7415df"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var database = firebase.database();
  var form = document.querySelector(".js-form");
  var formButton = document.querySelector(".js-form-button");
  
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    var fullName = document.querySelector(".js-fullname");
    var phoneNumber = document.querySelector(".js-phonenumber");
    var email = document.querySelector(".js-email");
    var contactPreference = document.querySelector(".js-contact-preference:checked");
    
    formButton.value = "Submitting...";
    formButton.setAttribute("disabled", "disabled");
    
    if (fullName.value.length >= 1 && phoneNumber.value.length >= 1 && email.value.length >= 1) {
      firebase.database().ref('users').push().set({
        fullname: fullName.value,
        email: email.value,
        phone: phoneNumber.value,
        contact_preference: contactPreference.getAttribute('data-preference');
      }, function (error) {
        if (error) {
          console.log("There's been some kind of error", error);
          formButton.removeAttribute("disabled", "disabled");
          formButton.setAttribute("value", formButton.getAttribute("data-original-value"));
          showErrorMessage();
        } else {
          console.log("It looks like everything was submitted successfully!");
        }
      });
    } else {
      showErrorMessage();
    }
  });
})();