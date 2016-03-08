var Twitter = new require('Twitter');
var hashtag = '#demdebate';

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

var pastTweets = [];
var curseWords = ['anal','anus','arse','ass','ballsack','balls','bastard','bitch','biatch','bloody','blowjob','blow job','bollock','bollok','boner','boob','bugger','bum','butt','buttplug','clitoris','cock','coon','crap','cunt','damn','dick','dildo','dyke','fag','feck','fellate','fellatio','felching','fuck','f u c k','fudgepacker','fudge packer','flange','Goddamn','God damn','hell','homo','jerk','jizz','knobend','knob end','labia','lmao','lmfao','muff','nigger','nigga','omg','penis','piss','poop','prick','pube','pussy','queer','scrotum','sex','shit','s hit','sh1t','slut','smegma','spunk','tit','tosser','turd','twat','vagina','wank','whore','wtf'];

function formatTweet(data) {
  var markup = '<p class="tweet-text">';
  var words = data.text.split(' ');
  words.forEach(function(e) {
    if (e.indexOf('@') == 0) {
      markup += ('<span class="-yellow"> ' + e + '</span>');
    }
    else if (e.indexOf('#') == 0) {
      markup += ('<span class="-black"> ' + e + '</span>');
    }
    else {
      markup += (' ' + e);
    }
  });
  markup += ('</p>');

  var tweet = {
      markup: markup,
      handle: '@' + data.user.screen_name,
      pic: data.user.profile_image_url.replace('_normal', '')
  };

  pastTweets.unshift(tweet);
  if (pastTweets.length > 6) {
    pastTweets.pop();
  }

  return tweet;
}

this.start = function(callback) {

  client.get('search/tweets', {q: hashtag}, function (error, tweets, response) {
      for (var i in tweets.statuses) {
          var tweet = formatTweet(tweets.statuses[i]);
          callback(tweet);
      }
  });

  client.stream('statuses/filter', {track: hashtag}, function (stream) {
      stream.on('data', function (data) {

          for (var i in curseWords) {
              if (data.text.toLowerCase().indexOf(curseWords[i]) >= 0) {
                  return;
              }
          }

          var tweet = formatTweet(data);
          callback(tweet);
      });
  });

}

this.getPastTweets = function() {
  return pastTweets;
}
