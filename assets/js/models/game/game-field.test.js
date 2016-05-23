define(function(require) {
  var Backbone = require('backbone');
  var GameField = require('models/game/game-field');

  var GameProps = require('models/game/game-props');
  var props = GameProps.get();

  var fieldCreator = function() {
    return new GameField(props);
  };

  QUnit.module('models/game/game-field');

  QUnit.test('Создание объекта GameField', function() {
    var field = fieldCreator();
    QUnit.ok(field instanceof Backbone.Model, 'Создали');
    QUnit.strictEqual(field.getProps(), props, 'Props сохранились');
  });

  QUnit.test('Пересечение кораблей intersectsShip', function() {
    var x = Math.floor(Math.random() * (props.getSize() - props.getMaxDeck())) + 1,
        y = Math.floor(Math.random() * (props.getSize() - props.getMaxDeck())) + 1,
        length = props.getMaxDeck(),
        isVertical = false;

    for(var _length = 1; _length < props.getMaxDeck() + 1; _length++) {
      for(var _x = 1; _x < props.getSize() + 2 - _length; _x++) {
        for(var _y = 1; _y < props.getSize() + 1; _y++) {
          // размещаем корабли вертикально
          var res = GameField.intersectsShip(x, y, length, isVertical, _x, _y, _length, false);
          var _res = GameField.intersectsShip(_x, _y, _length, false, x, y, length, isVertical);
          var is = _x >= x - _length && _x <= x + length
                    && _y >= y - 1 && _y <= y + 1;
          QUnit.ok(is ? res : !res, [x, y, length, isVertical,
                   _x, _y, _length, false, res, is].join());
          QUnit.ok(res == _res);

          // теперь размещаем горизонтально
          res = GameField.intersectsShip(x, y, length, isVertical, _x, _y, _length, true);
          _res = GameField.intersectsShip(_x, _y, _length, true, x, y, length, isVertical);
          is = _x >= x - 1 && _x <= x + length
                    && _y >= y - _length && _y <= y + 1;
          QUnit.ok(is ? res : !res, [x, y, length, isVertical,
                   _x, _y, _length, true, res, is].join());
          QUnit.ok(res == _res);
        }
      }
    }
  });

  QUnit.test('Проверка корабля checkShip', function() {
    var field = fieldCreator();

    var maxDeck = props.getMaxDeck(),
        size = props.getSize();

    QUnit.ok(!field.checkShip(1, 1, maxDeck + 1, false), 'size > max');
    QUnit.ok(!field.checkShip(0, 1, maxDeck, false), 'x < 0');
    QUnit.ok(!field.checkShip(1, 0, maxDeck, false), 'y < 0');
    QUnit.ok(!field.checkShip(size + 1, 1, maxDeck, true), 'x > size');
    QUnit.ok(!field.checkShip(1, size + 1, maxDeck, false), 'y > size');
    QUnit.ok(!field.checkShip(size - maxDeck + 2, 1, maxDeck, false), 'x + length > size');
    QUnit.ok(!field.checkShip(1, size - maxDeck + 2, maxDeck, true), 'y + length > size');
    QUnit.ok(field.checkShip(1, 1, 1, false), '1 --> (1, 1)');
    QUnit.ok(field.checkShip(size, size, 1, false), '1 --> (size, size)');
  });

  QUnit.test('Добавление кораблей addShip', function() {
    var field = fieldCreator();

    var maxDeck = props.getMaxDeck(),
        size = props.getSize();

    QUnit.ok(!field.addShip(size, size, maxDeck, false), 'max --> (size, size)');
    QUnit.ok(field.addShip(size, size, 1, false), '1 --> (size, size)');
    QUnit.ok(!field.addShip(size, size, 1, false), '1 --> (size, size) again');
    QUnit.ok(!field.addShip(size - 1, size - 1, 1, false), '1 --> (size - 1, size - 1)');
    QUnit.ok(field.addShip(size - 2, size - 2, 1, false), '1 --> (size - 2, size - 2)');
  });

  QUnit.test('Подсчет кораблей countShips', function() {
    var field = fieldCreator();

    var maxDeck = props.getMaxDeck(),
        size = props.getSize();

    QUnit.ok(field.addShip(size, size, 1, false), '+1');
    QUnit.ok(field.addShip(1, 1, 1, false), '+1');
    QUnit.ok(field.addShip(size - 3, size - 3, 2, true), '+2');

    QUnit.equal(field.countShips(1), 2, 'count(1) == 2');
    QUnit.equal(field.countShips(2), 1, 'count(2) == 1');
    QUnit.equal(field.countShips(3), 0, 'count(3) == 0');
  });

  QUnit.test('Соседние клетки getShipNearCells', function() {
    var cells = GameField.getShipNearCells(2, 2, 1, true, props);

    var expect = [
      [1, 1], [1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2], [3, 3]
    ];

    QUnit.ok(expect.length == cells.length
       && undefined == _.find(expect, function(expected) {
        var res = _.find(cells, function(cell) {
          return cell[0] == expected[0] && cell[1] == expected[1];
        });
        return !res;
      }), 'Все ожидаемые клетки найдены'
    );
  });

  QUnit.test('Клетки корабля getShipCells', function() {
    var cells = GameField.getShipCells(2, 2, props.getMaxDeck(), true);

    var expect = [];
    for(var i = 0; i < props.getMaxDeck(); i++) {
      expect.push([2, 2 + i]);
    }

    QUnit.ok(expect.length == cells.length
       && undefined == _.find(expect, function(expected) {
        var res = _.find(cells, function(cell) {
          return cell[0] == expected[0] && cell[1] == expected[1];
        });
        return !res;
      }), 'Все ожидаемые клетки найдены'
    );
  });

  QUnit.test('Случайное поле + isReady', function() {
    var fieldNotReady = fieldCreator();
    QUnit.ok(!fieldNotReady.isReady(), 'Пустое поле не готово');

    var field = GameField.generateRandomField(props);
    QUnit.ok(field.isReady(), 'Поле готово');
  });

  QUnit.test('Очистка clear', function() {
    var field = fieldCreator();

    field.addShip(1, 1, 1, false);

    QUnit.equal(field.getShips().length, 1, 'Добавлен один корабль');
    field.clear();
    QUnit.equal(field.getShips().length, 0, 'Поле очищено');
  });

  QUnit.test('Удаление корабля removeShip', function() {
    var field = fieldCreator();

    QUnit.ok(!field.removeShip(1, 1), 'Несуществующий корабль не удалился');

    field.addShip(1, 1, 1, false);
    field.addShip(3, 3, 2, true);

    QUnit.equal(field.getShips().length, 2, 'Добавлено два корабля');
    field.removeShip(1, 1);
    QUnit.equal(field.getShips().length, 1, 'Удален один корабль');

    var ships = field.getShips();

    QUnit.ok(ships[0][0] == 3
             && ships[0][1] == 3
             && ships[0][2] == 2
             && ships[0][3] === true, 'Удален верный корабль');

     field.removeShip(3, 3);
     QUnit.equal(field.getShips().length, 0, 'Удален второй корабль');
  });

  QUnit.test('Сдвиг корабля moveShip', function() {
    var field = fieldCreator();

    field.addShip(1, 1, 2, false);
    field.addShip(3, 3, 2, true);
    QUnit.equal(field.getShips().length, 2, 'Добавлено два корабля');

    QUnit.ok(!field.moveShip(1, 1, 2, 2), 'Нельзя передвинуть корабль на существующий другой');
    QUnit.ok(!field.moveShip(2, 2, 2, 2), 'Нельзя передвинуть несуществующий корабль');
    QUnit.ok(!field.moveShip(1, 1, props.getSize(), props.getSize()), 'Нельзя передвинуть корабль, выйдя за границы');
    QUnit.ok(field.moveShip(1, 1, 2, 1), 'Передвинули корабль');
    QUnit.ok(field.moveShip(2, 1, 1, 1), 'Передвинули корабль обратно');
  });

  QUnit.test('Поворот корабля rotateShip', function() {
    var field = fieldCreator();

    field.addShip(2, 1, 2, false);
    field.addShip(3, 3, 2, true);
    field.addShip(props.getSize() - 2, props.getSize() - 1, 3, false);
    QUnit.equal(field.getShips().length, 3, 'Добавлено три корабля');

    QUnit.ok(!field.rotateShip(2, 1), 'Нельзя повернуть корабль на существующий другой');
    QUnit.ok(!field.rotateShip(2, 2), 'Нельзя повернуть несуществующий корабль');
    QUnit.ok(!field.rotateShip(props.getSize() - 2, props.getSize() - 2), 'Нельзя повернуть корабль, выйдя за границы');
    QUnit.ok(field.rotateShip(3, 3), 'Повернули корабль');
    QUnit.ok(field.rotateShip(3, 3), 'Повернули корабль обратно');
  });
});
