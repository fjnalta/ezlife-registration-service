function changePassword() {
    grecaptcha.ready(function () {
        grecaptcha.execute('6LcRJusUAAAAAPNYUKeKTunJqjeUdzDFNPsFjWnS', { action: 'homepage' }).then(function (token) {
            $.ajax({
                type: 'POST',
                url: '/password',
                data: {
                    'token' : token,
                    'username' : $('#username').text(),
                    'password' : $('#currentPasswordInput').val(),
                    'newPassword' : $('#newPasswordInput').val(),
                    'newPassword2' : $('#repeatPasswordInput').val()
                },
                success: function() {
                    console.log('success');
                },
                error: function () {
                    console.log('failed');
                }
            });
        });
    });
}

function deleteAccount() {
    // TODO - implementation
    console.log('delete Account');
}

function logout() {
    // TODO - implementation
    console.log('logout');
}