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
        if ($(this).val().length < 0) {
            $(this).removeClass("is-valid").addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    });
    $("#surname").on("keyup", function () {
        if ($(this).val().length < 0) {
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
    let isMatch = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($("#email").val());
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

// TODO - handle response
function registerUser() {
    $("#registerBtn").prop("disabled", true);
    $.ajax({
        type: 'POST',
        url: '/register',
        data: {
            'username' : $('#username').val(),
            'name' : $('#name').val(),
            'surname' : $('#surname').val(),
            'email' : $('#email').val(),
            'password' : $('#password').val(),
            'password2' : $('#password2').val()
        },
        success: function(){
            //showRegistrationSuccessfulAlert();
            setTimeout(function(){
                location.reload();
            }, 1000)
        },
        error: function() {
            //showRegistrationFailAlert();
        }
    });
}