/*global $, now*/

var login = function () {

    function createUser() {
        var nick = $('#nick');
        // require a nick
        if (nick.val() === '') {
            nick.effect('pulsate');
            return false;
        }

        now.user.nick = nick.val();
        return true;
    }

    // user login dialog
    var login = $('<div>');
    login.append($('<input>', { id : 'nick' }));
    login.dialog({
        modal: true,
        title: 'Who are you?',
        buttons: [ { text: "Ok", click: function () { $(this).dialog("close"); } } ],
        beforeClose: createUser
    });

};