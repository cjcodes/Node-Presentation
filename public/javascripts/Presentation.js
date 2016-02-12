
var Presentation = function (hash) {
    var self = this;
    this.$div = $('#' + hash);
    this.slides = {};

    $.getJSON('/slides.json', function (data) {
        for (var i in data.backgrounds) {
            var uri = 'url(/images/slides/' + data.backgrounds[i] + ')';
            self.slides[data.backgrounds[i]] = $('<div class="slide">').css('background-image', uri);
        }

        self.slides['Twitter'] = $('<div class="slide twitter">').append($('<div class="tweets">'), $('<div class="fo-realz">').html('Tweets or it didn’t happen.<span>#DS2015</span>'));
        self.slides['Cheeky']  = $('<div class="slide cheeky">');
        self.slides['Journal'] = $('<iframe src="https://docs.google.com/presentation/d/1twkKkWqn6PCAlpNuglrPtwv1n0Lpm0d4MIhCinux5Kw/embed?start=true&loop=true&delayms=8000" frameborder="0" width="1920" height="1110"></iframe>');
        //self.slides['Timer']  = $('<div class="slide timer">');
        //
        for (var i in self.slides) {
            self.$div.append(self.slides[i].hide());
        }
        cheeky.init();
        Timer.init();

        if (hash == 'preview') {
            var keys = Object.keys(keymap);
            var key = 0;
            for (var i in self.slides) {
                var button = self.$button.clone(true).data('slide', i).text(i + ' ('+keys[key]+')').attr('data-shortcut', keys[key]);
                $('#button-controller').append(button);
                key++;
            }
        }
    });
};

Presentation.prototype.$button = $('<button>').click(function () {
    socket.emit('slide', $(this).data('slide'));
});

Presentation.prototype.update = function (slide) {
    var self = this;

    $.each(this.slides, function () {
        $(this).css('z-index', 0);
    });

    this.slides[slide].css('z-index', 100).fadeIn(function () {
        self.$div.find('.slide').not($(this)).hide();
    });
};

var queuer = {
    lastCommand: null,
    enqueue: function (data) {
        if (p !== undefined) {
            p.update(data);
        }

        queuer.lastCommand = data;
    },
    execute: function () {
        live.update(queuer.lastCommand);
    }
};
