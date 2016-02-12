
var cheeky = {
    $div: null,
    visible: false,
    init: function () {
        $('.cheeky').html($('<div>').addClass('cheeky-text'));
        cheeky.$div = $('.cheeky div');

        $('#cheeky-input').unbind().keydown(function (e) {
            if (e.keyCode == 13 && e.shiftKey) {
                e.preventDefault();
                socket.emit('cheeky', $(this).val().replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br/>$2'));
                $(this).val('');
            }
            e.stopPropagation();
        });
    },
    cheekyText: function (text) {
        if (text.indexOf('<i>') == 0) {
            var t = text.match(/<i>(.*)<\/i>/)[1].split('');
            text = '';

            $.each(t, function (i, e) {
                if (e !== ',' && e !== '$') {
                    e = '<span>' + e + '</span>';
                } else if (e == '$') {
                    e = '<i>$</i>';
                }

                text = text + e;
            });
        }
        cheeky.$div.html(text).css({
            width: 'auto',
            fontSize: '48px'
        });
        cheeky.visible = cheeky.$div.parent().is(':visible');
        cheeky.resizeText();
    },
    resizeText: function () {
        cheeky.$div.parent().show();

        var fontsize = cheeky.$div.css('font-size');
        cheeky.$div.css('fontSize', parseFloat(fontsize) + 5);

        if (cheeky.$div.height() <= cheeky.$div.parent().height() && cheeky.$div.width() < cheeky.$div.parent().width()){
            cheeky.resizeText();
        } else {
            cheeky.$div.css({
                fontSize: parseFloat(fontsize)*.8,
                width: '100%'
            });
            cheeky.center();
            if (!cheeky.visible) {
                cheeky.$div.parent().hide();
            }
        }
    },
    center: function () {
        var margin = (cheeky.$div.parent().height() - cheeky.$div.height()) / 2;
        cheeky.$div.css('margin-top', margin);
    }
}
