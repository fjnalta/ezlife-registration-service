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
                    $("#passwordChangeStatus").text("Änderung des Passworts erfolgreich");
                    $("#passwordChangeStatus").css("font-weight","Bold");
                    $("#passwordChangeStatus").css('color', 'green');
                    // Disable input fields
                    disableForms();
                },
                error: function () {
                    $("#passwordChangeStatus").text("Änderung des Passworts fehlgeschlagen");
                    $("#passwordChangeStatus").css("font-weight","Bold");
                    $("#passwordChangeStatus").css('color', 'red');
                    // Empty input fields
                    resetForms();
                }
            });
        });
    });
}

function resetForms() {
    $("#currentPasswordInput").val('');
    $("#newPasswordInput").val('');
    $("#repeatPasswordInput").val('');
    $("#changePasswordBtn").prop('disabled', true);
    $("#newPasswordInput").removeClass("is-valid").addClass("is-invalid");
    $("#repeatPasswordInput").removeClass("is-valid").addClass("is-invalid");
}

function disableForms() {
    $("#currentPasswordInput").prop('disabled', true);
    $("#newPasswordInput").prop('disabled', true);
    $("#repeatPasswordInput").prop('disabled', true);
    $("#changePasswordBtn").prop('disabled', true);
}

function deleteAccount() {
    grecaptcha.ready(function () {
        grecaptcha.execute('6LcRJusUAAAAAPNYUKeKTunJqjeUdzDFNPsFjWnS', { action: 'homepage' }).then(function (token) {
            $.ajax({
                type: 'POST',
                url: '/delete',
                data: {
                    'token' : token,
                    'username' : $('#username').text()
                },
                success: function() {
                    $("#accountDeleteStatus").text("Account wurde erfolgreich gelöscht");
                    $("#accountDeleteStatus").css("font-weight","Bold");
                    $("#accountDeleteStatus").css('color', 'green');
                },
                error: function () {
                    $("#accountDeleteStatus").text("Accountlöschung fehlgeschlagen");
                    $("#accountDeleteStatus").css("font-weight","Bold");
                    $("#accountDeleteStatus").css('color', 'red');
                }
            });
        });
    });
}