define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');
  QUnit.module('models/user');

  QUnit.test('Создание объекта User', function() {
    var u = new User({ login: 'le-me', name: 'Mr.White', email: 'ya@ya.ru' });

    QUnit.ok(u instanceof Backbone.Model, 'User со всеми заполненными полями');
  });

  QUnit.test('Валидация User', function() {
    var toTest = [
      [{}, 'Все поля пустые', ['login', 'name', 'email']],
      [{ login: '' }, 'Пустой login', ['login']],
      [{ login: '      ' }, 'login из пробелов', ['login']],
      [{ name: '' }, 'Пустой name', ['name']],
      [{ email: '' }, 'Пустой email', ['email']],
      [{ email: 'le-meyandex.ru' }, 'Email без собачки', ['email']],
      [{ login: 'my-login', name: 'My name', email: 'le-me@yandex.ru' }, 'Валидный кейс', []]
    ];

    _.each(toTest, function(item) {
      var uData = item[0],
          comment = item[1],
          errorFieldExpect = item[2] || [];

      var u = new User();
      var errorReal = u.validate(uData);

      if(errorReal === undefined) {
        // ошибки нет
        QUnit.ok(errorFieldExpect.length === 0, comment + ': без ошибок');
      }
      else
      {
        // поля с ошибками
        var errorFields = errorReal.map(function(error) {
          return error.field;
        });

        // убедимся, что валидация вернула ошибку в каждом из ожидаемых полей
        _.each(errorFieldExpect, function(expect) {
          QUnit.ok(errorFields.indexOf(expect) !== -1, comment + ': ошибка в поле ' + expect);
        });
      }
    });
  });
});
