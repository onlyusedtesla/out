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
  var app = firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  
})();