var auth2;

// Ensure auth2 object is initialized (important for signout), then load button
function initSigninV2() {
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: '609530060923-6a276d3itljrb5986lq2tlrgiudduafc.apps.googleusercontent.com'
    }).then(function (authInstance) {
      console.log("Making auth instance");
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
  var id_token = googleUser.getAuthResponse().id_token;
  /*fetch(`http://localhost:5001/delish-2/us-central1/verifyUserIdToken?text=${id_token}`, {mode: 'cors', headers: {'Content-Type': 'application/json'}})   
    .then((response) => {
      if(response.status != 200) { // If token was not valid, log error
        console.log('Invalid id_token for user, response:', response);
      } else {
        console.log('Successful id_token verification, response:', response);
      }
    });*/

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `http://localhost:5001/delish-2/us-central1/verifyUserIdToken`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.responseText != 'OK') {
      alert("User ID Token marked as Invalid. Try again or sign in to an alternate account.");
      signOut();
      return false;
    }
    console.log('Signed in as: ' + xhr.responseText);
  };
  xhr.send('idtoken=' + id_token);

  return true;
}

// On successful user sign in, verify id token and retrieve/store pertinent information
function onSuccess(googleUser) {

  if (!validUserIDToken(googleUser)) { // If user id token is not valid, cancel sign in functionality.
    return;
  }

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
