var config = require('./config');

var twitter = new require('twitter')(config.twitter);

module.exports.io = null;
var pastTweets = [];
var curseWords = ['anal','anus','arse','ass','ballsack','balls','bastard','bitch','biatch','bloody','blowjob','blow job','bollock','bollok','boner','boob','bugger','bum','butt','buttplug','clitoris','cock','coon','crap','cunt','damn','dick','dildo','dyke','fag','feck','fellate','fellatio','felching','fuck','f u c k','fudgepacker','fudge packer','flange','Goddamn','God damn','hell','homo','jerk','jizz','knobend','knob end','labia','lmao','lmfao','muff','nigger','nigga','omg','penis','piss','poop','prick','pube','pussy','queer','scrotum','sex','shit','s hit','sh1t','slut','smegma','spunk','tit','tosser','turd','twat','vagina','wank','whore','wtf'];

module.exports.start = function (io, hashtag) {
    module.exports.io = io;

    twitter.get('search/tweets', {q: hashtag}, function (error, tweets, response) {
        for (var i in tweets.statuses) {
            notifyTweet(tweets.statuses[i]);
        }
    });

    twitter.stream('statuses/filter', {track: hashtag}, function (stream) {
        stream.on('data', function (data) {
            for (var i in curseWords) {
                if (data.text.toLowerCase().indexOf(curseWords[i]) >= 0) {
                    return;
                }
            }

            notifyTweet(data);
        });
    });

    io.sockets.on('connection', function (socket) {
        for (var i in pastTweets) {
            socket.emit('tweet', pastTweets[i])
        }
    });
};


var even = false;
function notifyTweet(data) {
    var tweet = {
        text: data.text,
        handle: '@' + data.user.screen_name,
        pic: data.user.profile_image_url.replace('_normal', ''),
        stripe: (even) ? 'even' : 'odd'
    };
    even = !even;
    module.exports.io.sockets.emit('tweet', tweet);

    pastTweets.push(tweet);
    if (pastTweets.length > 10) {
        pastTweets.shift();
    }
}
