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

    var signupForm = $('#signupForm');
    var signupFormError = $('#signupFormError');
    var loginForm = $('#loginForm');
    var loginFormError = $('#loginFormError');
    var signupEmail = $('#signup_email');
    var signupUser = $('#signup_username');
    var signupPass = $('#signup_pass');
    var loginUser = $('#login_username');
    var loginPass = $('#login_pass');

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
        }
    })

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
        }
    })

})(window.jQuery);