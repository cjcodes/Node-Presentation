

var Tweet = function (tweet) {
    $.extend(this, tweet);

    this.text = this.text.replace(/#([^\s]+)/g, '<span class="hashtag">#$1</span>');
    //this.text = this.text.replace(/@([0-9a-zA-Z_]+)/g, '<span class="handle">@$1</span>');
};

Tweet.prototype.display = function () {
    var t = this.baseElement.clone();

    t.addClass(this.stripe);
    t.find('.text').html(this.text);
    t.find('img').attr('src', this.pic);
    t.find('.handle').text(this.handle);

    return t;
};

Tweet.prototype.baseElement = $('<div>').addClass('tweet').append(
    $('<img>'),
    $('<div>').append($('<div class="handle">'), $('<div class="text">'))
);