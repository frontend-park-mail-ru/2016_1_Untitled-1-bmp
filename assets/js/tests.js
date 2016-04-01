define(function(require) {
  var tests = [
    'qunit',
    'models/score.test',
    'models/user.test',
    'collections/scoreboard.test'
  ];
  require(tests, function(qunit) {
    qunit.start();
  });
});
