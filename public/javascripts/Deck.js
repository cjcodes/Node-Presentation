
var Deck = function (files, uri) {
    this.$e = this.baseElement.clone(true);
    for (var i in files) {
        var slide = this.slide.clone(true);
        var path = 'url('+uri+'/'+files[i]+')';

        slide.css('background-image', path);

        this.$e.append(slide);
    }

    this.reset();

    var self = this;
    $('body').keydown(function (e) {
        // 39 = right
        // 37 = left
        if (e.which == 39) {
            if (self.$e.is(':visible')) {
                self.next();
            }
        }
        if (e.which == 37) {
            if (self.$e.is(':visible')) {
                self.prev();
            }
        }
    });
};

Deck.prototype.baseElement = $('<div>').addClass('deck slide');

Deck.prototype.slide = $('<div>').addClass('deck-slide').hide();

Deck.prototype.get = function () {
    return this.$e;
};

Deck.prototype.next = function () {
    var current = this.$e.find('.deck-slide:visible');
    if (current.next().length > 0) {
        current.hide().next().show();
    }
};

Deck.prototype.prev = function () {
    var current = this.$e.find('.deck-slide:visible');
    if (current.prev().length > 0) {
        current.hide().prev().show();
    }
}

Deck.prototype.reset = function () {
    this.$e.find('.deck-slide:first-child').show();
};