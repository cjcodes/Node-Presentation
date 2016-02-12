
var WordFlipper = function (words, name, timer) {
    this.timer = (timer) ? timer : 2500;
    this.words = this.convertToArray(words);
    this.index = 0;
    this.reset = true;
    this.$element = this.baseElement.clone(true);
    this.$flipper = this.$element.find('.wrapper');
    this.$name = this.$element.find('.who');
    this.$word = this.$element.find('.word');

    var self = this;
    setInterval(function () {
        if (!self.$flipper.is(':visible')) {
            self.$flipper.css('-webkit-transform', 'rotateX(0deg)');
            self.$element.show();
            self.$flipper.css('margin-top', -self.$flipper.height()/2);
            self.$element.hide();
        }
    }, 1000);
};

WordFlipper.prototype.init = function () {
    var self = this;

    setInterval(function () {
        self.flip();
    }, self.timer);

    self.$name.text(self.words[self.index].who);
    self.$word.text(self.words[self.index].word);

    return this.$element;
};

WordFlipper.prototype.flip = function () {
    var self = this;

    this.index = (++this.index >= this.words.length) ? 0 : this.index;
    this.$flipper.css('-webkit-transform', 'rotateX(-90deg)');
    this.$flipper.on('webkitTransitionEnd', function () {
        $this = $(this);

        if (self.$name.text() == self.words[self.index].who) return;

        self.$name.text(self.words[self.index].who);
        self.$word.text(self.words[self.index].word);

        $this.css('margin-top', -$this.height()/2);
        $this.addClass('no-transition').css('-webkit-transform', 'rotateX(90deg)');

        setTimeout(function () {
            $this.removeClass('no-transition').css('-webkit-transform', 'rotateX(0deg)');
        }, 1);
    });
};

WordFlipper.prototype.baseElement = $('<div>').addClass('slide flipper').append(
    $('<div>').addClass('wrapper').append('<div class="word">', '<div class="who">')
);

WordFlipper.prototype.convertToArray = function (obj) {
    var arr = [];
    for (var i in obj) {
        arr.push({
            who:  i,
            word: obj[i]
        });
    }

    return arr;
};