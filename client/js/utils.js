/*global $, now*/

var login = function () {

    function createUser() {
        var nick = $('#nick');
        // require a nick
        if (nick.val() === '') {
            nick.effect('pulsate');
            return false;
        }

        // now.user.nick = nick.val();

        // simple and stupid
        var mailtest = /.*@.*\..*/;
        var mail = $('#email');
        if( ! mailtest.test( mail.val() ) ) {
           mail.effect('pulsate');
           return false; 
        }

        now.user.email = mail;
        return true;
    }

    // user login dialog
     var login = $('<div>');
    $('<p>', {html: 'Nick '} ).append($('<input>', { id : 'nick' }) ).appendTo(login);
    $('<p>', {html: 'Email '} ).append($('<input>', { id : 'email' }) ).appendTo(login);
    login.dialog({
        modal: true,
        title: 'Who are you?',
        buttons: [ { text: "Ok", click: function () { $(this).dialog("close"); } } ],
        beforeClose: createUser
    });

};

var _text = function (msg, timestamp) {
    
    var text, time;
    text = "";
    time = new Date(msg.time);

    if( timestamp ) text += "<span class='timestamp'>" + time + "</span> ";
    if( ! msg.anonym ) text += msg.from.nick + ': ';

    text += msg.content;
    return text;
}
