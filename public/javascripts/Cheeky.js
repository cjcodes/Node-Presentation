
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
            else if (e.shiftKey && e.ctrlKey) {
                socket.emit('cheeky-preview', $(this).val());
                var $div = $('#preview .cheeky div');
                cheeky.cheekyText($(this).val(), $div);
            }
            e.stopPropagation();
        });
    },
    cheekyText: function (text, $div) {
        if ($div == undefined) {
          $div = cheeky.$div;
        }
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
        $div.html(text).css({
            width: 'auto',
            fontSize: '48px'
        });
        cheeky.visible = $div.parent().is(':visible');
        cheeky.resizeText($div);
    },
    resizeText: function ($div) {
        $div.parent().show();

        var fontsize = $div.css('font-size');
        $div.css('fontSize', parseFloat(fontsize) + 5);

        if ($div.height() <= $div.parent().height() && $div.width() < $div.parent().width()){
            cheeky.resizeText($div);
        } else {
            $div.css({
                fontSize: parseFloat(fontsize)*.8,
                width: '100%'
            });
            cheeky.center($div);
            if (!cheeky.visible) {
                $div.parent().hide();
            }
        }
    },
    center: function ($div) {
        var margin = ($div.parent().height() - $div.height()) / 2;
        $div.css('margin-top', margin);
    }
}
