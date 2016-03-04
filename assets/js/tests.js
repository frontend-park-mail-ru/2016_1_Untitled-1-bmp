define(function(require) {
  var tests = [
    'models/score.test',
    'models/user.test',
    'collections/scoreboard.test'
  ];
  require(tests, function() {
  });
});
