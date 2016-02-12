
var Timer = {
    timer: null,
    val: 123,
    $div: $('<div class="timer">'),

    init: function () {
        $(document).ready(function () {
            $('.slide.timer').append(Timer.$div);
        });

        $('#start-timer').unbind().click(function (e) {
            socket.emit('timer', parseInt($('#timer-time').val()));
        });

        $('#timer-time').unbind().keydown(function (e) {
            e.stopPropagation();
        });

        socket.on('timer', function (data) {
            clearTimeout(Timer.timer);
            Timer.val = data+1;
            Timer.flip();
        });
    },

    flip: function () {
        if (Timer.val <= 0) return;
        Timer.val--;
        if (Timer.val <= 10) {
            Timer.$div.parent().addClass('low');
        } else {
            Timer.$div.parent().removeClass('low');
        }
        Timer.$div.text(Timer.val);
        Timer.timer = setTimeout(Timer.flip, 1000);
    }
};
