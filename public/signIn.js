var auth2;

// Ensure auth2 object is initialized (important for signout), then load button
function initSigninV2() {
  console.log("Starting here...")
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: '609530060923-6a276d3itljrb5986lq2tlrgiudduafc.apps.googleusercontent.com'
    }).then(function (authInstance) {
      console.log("Making auth instance")
      auth2 = authInstance;
      renderButton();
    });
  })
}

// Render the google sign in button as well as information scope
function renderButton() {
  // Set scope and success/failure functions
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 42,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}

// On successful user sign in, retrieve and store pertinent information
function onSuccess(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('User ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Logged in as: ' + profile.getName());
  console.log('User Image URL: ' + profile.getImageUrl());
  console.log('User email: ' + profile.getEmail()); // Will be null if email scope not set
  document.getElementById("my-signin2").style.display = 'none';
  document.getElementById("signout").style.display = 'block';
}

// If sign in fails
function onFailure(error) {
  console.log(error);
}

// Attempt to sign user out
function signOut() {
  console.log("Signing user out")
  if (auth2 != null) {
    auth2.signOut().then(function () {
      auth2.disconnect();
      //Make sign in button reappear, hide sign out button
      document.getElementById("signout").style.display = 'none';
      document.getElementById("my-signin2").style.display = 'block';
    });
  }
}