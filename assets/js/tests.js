define(function(require) {
  var tests = [
    'qunit',
    'sinon',
    'models/score.test',
    'models/user.test',
    'collections/scoreboard.test',
    'views/manager.test'
  ];
  require(tests, function(qunit) {
    qunit.start();
  });
});
