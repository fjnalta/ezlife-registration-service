$(document).ready(function () {
    checkUserDetails();
    checkPasswords();
    checkEverythingValid();
});

function checkUserDetails() {
    $("#username").on("keyup", function () {
        if ($(this).val().length < 3) {
            $(this).removeClass("is-valid").addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
        // set E-Mail
        if ($(this).val().length > 0) {
            $("#email").val($(this).val() + "@ezlife.eu");
        } else {
            $("#email").val("user@ezlife.eu");
        }
        // check E-Mail
        checkEmail();
    });


    $("#name").on("keyup", function () {
        if ($(this).val().length < 3) {
            $(this).removeClass("is-valid").addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    });
    $("#surname").on("keyup", function () {
        if ($(this).val().length < 3) {
            $(this).removeClass("is-valid").addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    });
}

function checkPasswords() {
    $("#password").on("keyup", function () {
        if ($(this).val() != $("#password2").val()) {
            $("#password2").removeClass("is-valid").addClass("is-invalid");
        } else {
            $("#password2").removeClass("is-invalid").addClass("is-valid");
        }

        // check password policy
        if ($(this).val().length < 5) {
            $(this).removeClass("is-valid").addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    });

    $("#password2").on("keyup", function () {
        if ($("#password").val() == $(this).val() && $("#password").val().length > 0) {
            $(this).removeClass("is-invalid").addClass("is-valid");
        } else {
            $(this).removeClass("is-valid").addClass("is-invalid");
        }
    });
}

function checkEmail() {
    let isMatch = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#email").val());
    if (isMatch) {
        $("#email").removeClass("is-invalid").addClass("is-valid");

    } else {
        $("#email").removeClass("is-valid").addClass("is-invalid");
    }
}

function checkEverythingValid() {
    $(document).on("keyup", function () {
        if(
            $("#username").hasClass("is-valid") &&
            $("#name").hasClass("is-valid") &&
            $("#surname").hasClass("is-valid") &&
            $("#email").hasClass("is-valid") &&
            $("#password").hasClass("is-valid") &&
            $("#password2").hasClass("is-valid")
        ) {
            $("#registerBtn").prop("disabled", false);
        } else {
            $("#registerBtn").prop("disabled", true);
        }
    });
}

function registerUser() {
    $("#registerBtn").prop("disabled", true);
    grecaptcha.ready(function() {
        grecaptcha.execute('6LcRJusUAAAAAPNYUKeKTunJqjeUdzDFNPsFjWnS', {action: 'homepage'}).then(function(token) {
            $.ajax({
                type: 'POST',
                url: '/register',
                data: {
                    'username' : $('#username').val(),
                    'name' : $('#name').val(),
                    'surname' : $('#surname').val(),
                    'email' : $('#email').val(),
                    'password' : $('#password').val(),
                    'password2' : $('#password2').val(),
                    'token': token
                },
                success: function(){
                    $("#registrationStatus").text("Registrierung erfolgreich! - Wenn Sie nicht automatisch weitergeleitet werden, laden Sie bitte die Seite neu");
                    $("#registrationStatus").css("font-weight","Bold");
                    $("#registrationStatus").css('color', 'green');
                    disableFields();
                    // TODO - popup
                },
                error: function() {
                    $("#registrationStatus").text("Registrierung fehlgeschlagen! - Bitte versuchen Sie einen anderen Benutzernamen");
                    $("#registrationStatus").css("font-weight","Bold");
                    $("#registrationStatus").css('color', 'red');
                    emptyFields();
                    // TODO - popup
                }
            });
        });
    });
}

function emptyFields() {
    $("#username").empty();
    $("#name").empty();
    $("#surname").empty();
    $("#email").empty();
    $("#password").empty();
    $("#password2").empty();
}

function disableFields() {
    $("#username").prop('disabled', true);
    $("#name").prop('disabled', true);
    $("#surname").prop('disabled', true);
    $("#email").prop('disabled', true);
    $("#password").prop('disabled', true);
    $("#password2").prop('disabled', true);
}