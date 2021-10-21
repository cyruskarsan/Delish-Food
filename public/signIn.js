var auth2;

// Ensure auth2 object is initialized (important for signout), then load button
function initSigninV2() {
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: '609530060923-6a276d3itljrb5986lq2tlrgiudduafc.apps.googleusercontent.com'
    }).then(function (authInstance) {
      auth2 = authInstance;
      renderButton();
    });
  });
}

// Render the google sign in button as well as information scope
function renderButton() {
  // Set scope and success/failure functions
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': '240vw',
    'height': 42,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}

// Ensure the validity of user id token, returns true if valid, otherwise false
function validUserIDToken(googleUser) {
  // Retrieve user id token.
  var id_token = googleUser.getAuthResponse().id_token;

  // Make request to token verification on backend.
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `http://localhost:5001/delish-2/us-central1/verifyUserIdToken`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.responseText != 'OK') {
      alert("User ID Token marked as Invalid. Try again or sign in to an alternate account.");
      signOut();
      return false;
    }
  };
  xhr.send('idtoken=' + id_token);

  // After token has been verified, complete user setup, if successful, return true for valid token
  let validSetup = userSetup(googleUser);
  if (!validSetup) { // If set up fails due to internal error, inform user and request them to try again.
    alert("Failure to set up or retrieve user information. We apologize for the inconvenience. Please try again.");
    signOut();
    return false;
  }

  return true;
}

// On valid user token, setup the user for site use (intialize user in database or return ratings and favorites)
function userSetup(googleUser) {

  // Now that the token is verfied, retreive id to set up the user in the database.
  let profile = googleUser.getBasicProfile();
  let userID = profile.getId();

  // Make request to backend with specified user id.
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `http://localhost:5001/delish-2/us-central1/setupUser`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status == 500) {
      alert("User ID Token marked as Invalid. Try again or sign in to an alternate account.");
      signOut();
      return false;
    }
  };
  xhr.send('userID=' + userID);

  return true;
}

// On successful user sign in, verify id token and retrieve/store pertinent information
function onSuccess(googleUser) {

  if (!validUserIDToken(googleUser)) { // If user id token is not valid, cancel sign in functionality.
    return;
  }

  // Log user and store pertinent profile features.
  var profile = googleUser.getBasicProfile();
  let profileImage = profile.getImageUrl();
  let userName = profile.getName();
  let userEmail = profile.getEmail(); // Will be null if email scope not set
  console.log('Logged in as: ' + userName);

  // Make sign in button invisible and make sign out button visible.
  document.getElementById("my-signin2").style.display = 'none';
  document.getElementById("signout").style.display = 'block';
}

// If sign in fails
function onFailure(error) {
  console.log(error);
}

// Attempt to sign user out
function signOut() {
  console.log("Signing user out.")
  if (auth2 != null) {
    auth2.signOut().then(function () {
      auth2.disconnect();
      //Make sign in button reappear, hide sign out button
      document.getElementById("signout").style.display = 'none';
      document.getElementById("my-signin2").style.display = 'block';
    });
  }
}
