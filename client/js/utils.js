/*global $, now*/
var login = function () {

    function createUser() {
        var state = true;

        var nick = $('#nick');
        // require a nick
        if (nick.val() === '') {
            nick.effect('pulsate');
            state = false;
        }

        // simple and stupid
        var mailtest = /.*@.*\..*/;

        var mail = $('#email');

        if( ! mailtest.test(mail.val()) ) {
           mail.effect('pulsate');
           state = false;
        }

        if( state ) {
            now.user.nick = nick.val();
            now.user.email = mail.val();
            now.join();
        }
        return state;
    }

    // user login dialog
    var login = $('<div>');

    var data = JSON.parse( $.cookie( 'chat-user' ) );
    var d = { nick : "", email : "" };

    if( data ) {
        d.nick = data.nick;
        d.email = data.email;
    }

    $('<p>', {html: 'Nick '} ).append($('<input>', { id : 'nick', val : d.nick }) ).appendTo(login);
    $('<p>', {html: 'Email '} ).append($('<input>', { id : 'email', val: d.email }) ).appendTo(login);
    $('<p>', {html: 'This system is a research prototype from <a target="_blank" href="http://www.hiit.fi">Helsinki Institute for Information technology</a>. By using the system, you agree on the <a target="_blank" href="http://foot.hiit.fi/main/doku.php/modalities_research_agreement">research terms</a>.', style: 'font-size: small' }).appendTo(login);
    login.dialog({
        modal: true,
        title: 'Who are you?',
        buttons:[
		   { text: "Terms of use", click: function(){ window.open("http://foot.hiit.fi/main/doku.php/modalities_research_agreement", "_blank"); } }, 
		   { text: "Ok", click: function () { $(this).dialog("close"); } }
		],
        beforeClose: createUser,
	width: 600
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
