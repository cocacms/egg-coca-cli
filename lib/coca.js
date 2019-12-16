#!/usr/bin/env node

'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require('commander');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

var runner = function runner(sh) {
  return new _promise2.default(function (resolve) {
    exec(sh, { cwd: process.cwd() }, function (err, msg) {
      if (err) {
        console.log(err.message);
        resolve();
      } else {
        console.log(msg);
        resolve();
      }
    });
  });
};

program.version('1.0.0');

program.command('rsa').action((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var private_path, public_path;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          private_path = path.join(process.cwd(), './config/rsa/rsa_private_key.pem');
          public_path = path.join(process.cwd(), './config/rsa/rsa_public_key.pem');
          _context.next = 4;
          return runner('openssl genrsa -out ' + private_path + ' 1024');

        case 4:
          _context.next = 6;
          return runner('openssl rsa -in ' + private_path + ' -pubout -out ' + public_path);

        case 6:

          console.log('\u751F\u6210rsa\u6587\u4EF6\u6210\u529F');
          console.log('\u79C1\u94A5\u8DEF\u5F84:' + private_path);
          console.log('\u516C\u94A5\u8DEF\u5F84:' + public_path);

        case 9:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})));

program.command('migrate').option('-e, --env [env]', 'The environment to run the command in', 'development').action(function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
    var plugins, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pluginName, pkg, has_mig_dir, migrations_dir, stat;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            plugins = require(path.join(process.cwd(), './config/plugin.js'));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 4;
            _iterator = (0, _getIterator3.default)((0, _keys2.default)(plugins));

          case 6:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 24;
              break;
            }

            pluginName = _step.value;
            pkg = plugins[pluginName];

            if (!(!pkg.enable || !pkg.package)) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt('continue', 21);

          case 11:
            has_mig_dir = fs.existsSync(migrations_dir);

            if (has_mig_dir) {
              _context2.next = 14;
              break;
            }

            return _context2.abrupt('continue', 21);

          case 14:
            migrations_dir = path.join(process.cwd(), './node_modules', pkg.package, 'migrations');
            stat = fs.statSync(migrations_dir);

            if (stat.isDirectory()) {
              _context2.next = 18;
              break;
            }

            return _context2.abrupt('continue', 21);

          case 18:
            console.log('\u8FD0\u884C\u63D2\u4EF6 [' + pluginName + '] \u7684migrations\u6587\u4EF6...');
            _context2.next = 21;
            return runner('npx sequelize db:migrate --env=' + options.env + ' --config=' + path.join(process.cwd(), './database/config.json') + ' --migrations-path=' + migrations_dir);

          case 21:
            _iteratorNormalCompletion = true;
            _context2.next = 6;
            break;

          case 24:
            _context2.next = 30;
            break;

          case 26:
            _context2.prev = 26;
            _context2.t0 = _context2['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 30:
            _context2.prev = 30;
            _context2.prev = 31;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 33:
            _context2.prev = 33;

            if (!_didIteratorError) {
              _context2.next = 36;
              break;
            }

            throw _iteratorError;

          case 36:
            return _context2.finish(33);

          case 37:
            return _context2.finish(30);

          case 38:

            console.log('\u8FD0\u884C\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u7684migrations\u6587\u4EF6...');
            _context2.next = 41;
            return runner('npx sequelize db:migrate --env=' + options.env + ' --config=' + path.join(process.cwd(), './database/config.json'));

          case 41:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 26, 30, 38], [31,, 33, 37]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());

program.command('add').description('add a migration').option('-p, --plugin [name]', 'Which setup mode to use').option('-e, --env [env]', 'The environment to run the command in', 'development').option('-c, --config [path]', 'The path to the config file').option('-o, --options-path  [path]', 'The path to a JSON file with additional options').option('-s, --seeders-path  [path]', 'The path to the seeders folder', 'seeders').option('-m, --models-path  [path]', 'The path to the models folder', 'models').option('-u, --url  [url]', 'The database connection string to use. Alternative to using --config files').option('-d, --debug', 'When available show various debug information', false).requiredOption('-n, --name [name]', 'Defines the name of the migration').option('-ud, --underscored', "Use snake case for the timestamp's attribute names", false).action(function (options) {
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