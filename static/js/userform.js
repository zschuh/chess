(function ($) {
    function checkEmail(email) {
        if (!email) { throw 'Email must be given' }
        if (typeof email !== 'string') { throw 'Email must be of type string' }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) { throw 'Not a valid email' }
    }

    function checkUsername(username) {
        if (!username) { throw 'Username must be supplied' }
        if (typeof username !== 'string') { throw 'Username must be of type string' }
        if (username.length === 0) { throw 'Username must not be empty' }
        if (!/^[a-zA-Z0-9]*$/.test(username)) { throw 'Username can only be made up of alphanumeric characters a-z and 0-9' }
        if (username.length < 4) { throw 'Username must be at least 4 characters long' }
    }
    
    function checkPassword(password) {
        if (!password) { throw 'Password must be supplied' }
        if (typeof password !== 'string') { throw 'Password must be of type string' }
        if (password.length === 0) { throw 'Password must not be empty' }
        if (!/^[^\s]*$/.test(password)) { throw 'Password can not contain any spaces' }
        if (password.length < 6) { throw 'Password must be at least 6 characters long' }
    }

    function displayUserData() {
        // ajax call to get user data from database
        let requestConfig = {
            method: 'GET',
            url: '/userdata',
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage.userData) {
                loginSignupDiv.hide();

                let userInfo = responseMessage.userData; // for easier reference in the jquery appends to follow
                userInfoTitle.html(`${userInfo.username}'s Info!`);
                userInfoList.append(`<li>Email: ${userInfo.email}</li>`);
                userInfoList.append(`<li>Username: ${userInfo.username}</li>`);
                //Uses the same alg to calculate the score (better since no db call)
                userInfoList.append(`<li>Score: ${userInfo.rating.losses === 0 ? (userInfo.rating.wins === 0 ? 0 : 100 + userInfo.rating.wins) : (100*userInfo.rating.wins/userInfo.gamesPlayed.length)+userInfo.rating.wins}</li>`)
                //Gets from the rating object
                userInfoList.append(`<li>Wins: ${userInfo.rating.wins} | Losses: ${userInfo.rating.losses}`);
                //| Score: ${userScore}</li>`);
                userInfoList.append(`<li>Games Played: ${userInfo.gamesPlayed.length}</li>`);

                // if the navbar only has 5 tabs, add the logout tab. this is only necessary immediately after logging in,
                // as afterwards the session will recognize that you are logged in and add the tab to the handlebar itself
                if (loggedIn === 0) {
                    $('#navbar').append(`<li id="logout-li" class="nav-item">
                                            <a class="nav-link" href="/logout">Log Out</a>
                                        </li>`);
                }

                userInfoDiv.show();
            }
        })
    }

    // this variable is used to determine whether you're logged in already upon ariving at the user page
    // if 0, it will be used to add a logout tab to the top of the screen upon login/signup.
    // if 1, it should already have the tab at the top of the screen, so a new tab won't be added.
    var loggedIn = 0;

    // if user is logged in (via req.session in routes), check the hidden div #user-div in handlebar for username,
    // then display user data
    if ($('#logout-li').length > 0) {
        loggedIn = 1;
        displayUserData();
    }

    var userInfoDiv = $('#user-info');
    var userInfoTitle = $('#user-info-title');
    var loginSignupDiv = $('#login-signup-div');
    var userInfoList = $('#user-info-list');
    var signupForm = $('#signupForm');
    var signupFormError = $('#signupFormError');
    var loginForm = $('#loginForm');
    var loginFormError = $('#loginFormError');
    var signupEmail = $('#signup_email');
    var signupUser = $('#signup_username');
    var signupPass = $('#signup_pass');
    var loginUser = $('#login_username');
    var loginPass = $('#login_pass');

    // This hits on signup submission
    signupForm.submit(function (event) {
        event.preventDefault();

        let errorMsg ="";
        var signup_email = signupEmail.val();
        var signup_user = signupUser.val();
        var signup_pass = signupPass.val();

        try {
            checkEmail(signup_email);
            checkUsername(signup_user);
            checkPassword(signup_pass);
        } catch (e) {
            errorMsg = e;
        }
        if (errorMsg) {
            signupFormError.html(errorMsg);
            signupFormError.show();
        }
        else {
            signupFormError.hide();

            // do ajax post call to database functions
            let requestConfig = {
                method: 'POST',
                url: '/user',
                contentType: 'application/json',
                data: JSON.stringify({
                    email: signup_email,
                    username: signup_user,
                    password: signup_pass
                })
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                if (responseMessage.success) {
                    // if signup was a success then hide login/signup forms and display user data
                    displayUserData();
                }
                else if (responseMessage.error) {
                    signupFormError.html(responseMessage.error);
                    signupFormError.show();
                }
            });
        }
    })

    // This hits on login submission
    loginForm.submit(function (event) {
        event.preventDefault();

        let errorMsg = "";
        var login_user = loginUser.val();
        var login_pass = loginPass.val();

        try {
            checkUsername(login_user);
            checkPassword(login_pass);
        } catch (e) {
            errorMsg = e;
        }
        if (errorMsg) {
            loginFormError.html(errorMsg);
            loginFormError.show();
        }
        else {
            loginFormError.hide();

            // do ajax post call to database functions
            let requestConfig = {
                method: 'POST',
                url: '/user',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: login_user,
                    password: login_pass
                })
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                if (responseMessage.success) {
                    // if login was a success then hide login/signup forms and display user data
                    displayUserData();
                }
                else if (responseMessage.error) {
                    loginFormError.html(responseMessage.error);
                    loginFormError.show();
                }
            });
        }
    })
})(window.jQuery);