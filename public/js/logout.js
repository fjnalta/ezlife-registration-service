function logout() {
    grecaptcha.ready(function() {
        grecaptcha.execute('6LcRJusUAAAAAPNYUKeKTunJqjeUdzDFNPsFjWnS', {action: 'homepage'}).then(function(token) {
            $.ajax({
                type: 'POST',
                url: '/logout',
                data: {
                    'token': token
                }
            });
        });
    });
}