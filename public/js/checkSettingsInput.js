$(document).ready(function () {
    checkPasswordInput();
    checkEverythingValid();
});

function checkPasswordInput() {
    $("#newPasswordInput").on("keyup", function () {
        if ($(this).val() != $("#repeatPasswordInput").val()) {
            $("#newPasswordInput").removeClass("is-valid").addClass("is-invalid");
        } else {
            $("#newPasswordInput").removeClass("is-invalid").addClass("is-valid");
        }

        // check password policy
        if ($(this).val().length < 5) {
            $(this).removeClass("is-valid").addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid").addClass("is-valid");
        }

        if ($("#repeatPasswordInput").val() == $(this).val() && $("#repeatPasswordInput").val().length > 0) {
            $("#repeatPasswordInput").removeClass("is-invalid").addClass("is-valid");
        } else {
            $("#repeatPasswordInput").removeClass("is-valid").addClass("is-invalid");
        }
    });

    $("#repeatPasswordInput").on("keyup", function () {
        if ($("#newPasswordInput").val() == $(this).val() && $("#newPasswordInput").val().length > 0) {
            $(this).removeClass("is-invalid").addClass("is-valid");
        } else {
            $(this).removeClass("is-valid").addClass("is-invalid");
        }
    });
}

function checkEverythingValid() {
    $(document).on("keyup", function () {
        if(
            $("#newPasswordInput").hasClass("is-valid") &&
            $("#repeatPasswordInput").hasClass("is-valid")
        ) {
            $("#changePasswordBtn").prop("disabled", false);
        } else {
            $("#changePasswordBtn").prop("disabled", true);
        }
    });
}