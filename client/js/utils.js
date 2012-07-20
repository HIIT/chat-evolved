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

var _text = function (msg, timestamp) {
    
    var text, time;
    text = "";
    time = new Date(msg.time);

    if( timestamp ) text += "<span class='timestamp'>" + time + "</span> ";
    if( ! msg.anonym ) text += msg.from.nick + ': ';

    text += msg.content;
    return text;
}