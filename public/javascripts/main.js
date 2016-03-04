
var socket = io.connect(window.location.origin);

socket.on('slide', function (data) {
    queuer.enqueue(data);
});

socket.on('golive', function () {
    queuer.execute();
});

socket.on('cheeky', function (text) {
    cheeky.cheekyText(text);
});

socket.on('cheeky-preview', function (text) {
    var $div = $('#preview .cheeky div');
    cheeky.cheekyText(text, $div);
    $('#cheeky-input').val(text);
});

socket.on('tweet', function (tweet) {
    var t = new Tweet(tweet);
    $('.tweets').prepend(t.display());
    $('.slide.twitter').each(function () {
        var $t = $(this);
        $t.find('.tweet:first-child').hide().css('opacity', 0).slideDown('slow').animate({ opacity: 1 }, { queue: false, duration: 'slow' });
        var len = $t.find('.tweet').length;
        if (len > 6) {
            $t.find('.tweet')[len-1].remove();
        }
    });
});

var keymap = {
    q: 81,
    w: 87,
    e: 69,
    r: 82,
    t: 84,
    y: 89,
    z: 90,
    x: 88,
    c: 67,
    v: 86,
    b: 66
};

for (var i = 1; i < 10; i++) {
    keymap[i] = 48+i;
}

$(document).keydown(function (event) {
    if (event.keyCode === 71) {
        $('#golive').click();
    } else {
        var pos = Object.keys(keymap).filter(function (key) {
            return keymap[key] == event.keyCode;
        });
        if (pos[0] !== undefined) {
            $('button[data-shortcut='+pos+']').click();
        }
    }
});

$('#golive').click(function () {
    socket.emit('golive');
});

var live = new Presentation('present');
if ($('#preview').length > 0) {
    var p = new Presentation('preview');
}
