#!/usr/bin/env node

'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var program = require('commander');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

var runner = function runner(sh) {
  return new Promise(function (resolve, reject) {
    exec(sh, { cwd: process.cwd() }, function (err, msg) {
      if (err) {
        reject(err);
      } else {
        console.log(msg);
        resolve();
      }
    });
  });
};

program.version('1.0.0');

program.command('rsa').action(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var private_path, public_path;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('process.cwd() is ', process.cwd());
          private_path = path.join(process.cwd(), './config/rsa/rsa_private_key.pem');
          public_path = path.join(process.cwd(), './config/rsa/rsa_public_key.pem');
          _context.next = 5;
          return runner('openssl genrsa -out ' + private_path + ' 1024');

        case 5:
          _context.next = 7;
          return runner('openssl rsa -in ' + private_path + ' -pubout -out ' + public_path);

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})));

program.command('migrate').option('-e, --env [env]', 'The environment to run the command in', 'development').action(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
    var plugins, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, plugin, stat;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('process.cwd() is ', process.cwd());

            plugins = fs.readdirSync(path.join(process.cwd(), './lib/plugin'));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 5;
            _iterator = plugins[Symbol.iterator]();

          case 7:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 16;
              break;
            }

            plugin = _step.value;
            stat = fs.statSync(path.join(process.cwd(), './lib/plugin', plugin));

            if (!(stat.isDirectory() && fs.existsSync(path.join(process.cwd(), './lib/plugin', plugin, 'migrations')))) {
              _context2.next = 13;
              break;
            }

            _context2.next = 13;
            return runner('npx sequelize db:migrate --env=' + options.env + ' --config=' + path.join(process.cwd(), './database/config.json') + ' --migrations-path=' + path.join(process.cwd(), './lib/plugin', plugin, 'migrations'));

          case 13:
            _iteratorNormalCompletion = true;
            _context2.next = 7;
            break;

          case 16:
            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 22:
            _context2.prev = 22;
            _context2.prev = 23;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 25:
            _context2.prev = 25;

            if (!_didIteratorError) {
              _context2.next = 28;
              break;
            }

            throw _iteratorError;

          case 28:
            return _context2.finish(25);

          case 29:
            return _context2.finish(22);

          case 30:
            _context2.next = 32;
            return runner('npx sequelize db:migrate --env=' + options.env + ' --config=' + path.join(process.cwd(), './database/config.json'));

          case 32:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[5, 18, 22, 30], [23,, 25, 29]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());

program.command('add').description('add a migration').option('-p, --plugin [name]', 'Which setup mode to use').option('-e, --env [env]', 'The environment to run the command in', 'development').option('-c, --config [path]', 'The path to the config file').option('-o, --options-path  [path]', 'The path to a JSON file with additional options').option('-s, --seeders-path  [path]', 'The path to the seeders folder', 'seeders').option('-m, --models-path  [path]', 'The path to the models folder', 'models').option('-u, --url  [url]', 'The database connection string to use. Alternative to using --config files').option('-d, --debug', 'When available show various debug information', false).requiredOption('-n, --name [name]', 'Defines the name of the migration').option('-ud, --underscored', "Use snake case for the timestamp's attribute names", false).action(function (options) {
  console.log('process.cwd() is ', process.cwd());
  var args = [];
  if (options.env) args.push('--env=' + options.env);
  if (options.config) args.push('--config=' + options.config);
  if (options['options-path']) {
    args.push('--options-path=' + options['options-path']);
  }

  if (options['seeders-path']) {
    args.push('--seeders-path=' + options['seeders-path']);
  }

  if (options['models-path']) {
    args.push('--models-path=' + options['models-path']);
  }

  if (options.url) args.push('--url=' + options.url);
  if (options.name) args.push('--name=' + options.name);
  if (options.debug) args.push('--debug');
  if (options.underscored) args.push('--underscored');

  if (options.plugin) {
    args.push('--migrations-path=' + path.join(process.cwd(), 'lib/plugin/egg-coca-' + options.plugin, 'migrations'));
  }

  exec('npx sequelize migration:generate ' + args.join(' '), function (err, msg) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(msg);
    }
  });
});

program.parse(process.argv);