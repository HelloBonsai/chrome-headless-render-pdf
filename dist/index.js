'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CDP = require('chrome-remote-interface');
var fs = require('fs');
var cp = require('child_process');
var net = require('net');
var commandExists = require('command-exists');

var RenderPDF = function () {
  function RenderPDF(options) {
    (0, _classCallCheck3.default)(this, RenderPDF);

    this.setOptions(options || {});
    this.chrome = null;

    if (this.options.remoteHost) {
      this.host = this.options.remoteHost;
      this.port = this.options.remotePort;
    } else {
      this.host = 'localhost';
      this.port = Math.floor(Math.random() * 10000 + 1000);
    }
  }

  (0, _createClass3.default)(RenderPDF, [{
    key: 'setOptions',
    value: function setOptions(options) {
      this.options = {
        printLogs: def('printLogs', false),
        printErrors: def('printErrors', true),
        chromeBinary: def('chromeBinary', null),
        chromeOptions: def('chromeOptions', []),
        remoteHost: def('remoteHost', null),
        remotePort: def('remotePort', 9222),
        noMargins: def('noMargins', false),
        landscape: def('landscape', undefined),
        paperWidth: def('paperWidth', undefined),
        paperHeight: def('paperHeight', undefined),
        includeBackground: def('includeBackground', undefined),
        pageRanges: def('pageRanges', undefined),
        timeout: def('timeout', null)
      };

      this.commandLineOptions = {
        windowSize: def('windowSize', undefined)
      };

      function def(key, defaultValue) {
        return options[key] === undefined ? defaultValue : options[key];
      }
    }
  }, {
    key: 'renderPdf',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(url, options) {
        var _this = this;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt('return', new _promise2.default(function (resolve, reject) {
                  CDP({ host: _this.host, port: _this.port }, function () {
                    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(client) {
                      var timeoutTimer, Page, Emulation, LayerTree, loaded, jsDone, pdf, buff;
                      return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              _context4.prev = 0;
                              timeoutTimer = void 0;
                              Page = client.Page, Emulation = client.Emulation, LayerTree = client.LayerTree;


                              _this.log('Opening ' + url);

                              _context4.next = 6;
                              return Page.enable();

                            case 6:
                              _context4.next = 8;
                              return LayerTree.enable();

                            case 8:
                              loaded = _this.cbToPromise(Page.loadEventFired);
                              jsDone = _this.cbToPromise(Emulation.virtualTimeBudgetExpired);
                              _context4.next = 12;
                              return Page.navigate({ url: url });

                            case 12:
                              _context4.next = 14;
                              return Emulation.setVirtualTimePolicy({ policy: 'pauseIfNetworkFetchesPending', budget: 5000 });

                            case 14:
                              _context4.next = 16;
                              return _this.profileScope('Wait for load', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                  while (1) {
                                    switch (_context.prev = _context.next) {
                                      case 0:
                                        _context.next = 2;
                                        return loaded;

                                      case 2:
                                      case 'end':
                                        return _context.stop();
                                    }
                                  }
                                }, _callee, _this);
                              })));

                            case 16:
                              _context4.next = 18;
                              return _this.profileScope('Wait for js execution', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                  while (1) {
                                    switch (_context2.prev = _context2.next) {
                                      case 0:
                                        _context2.next = 2;
                                        return jsDone;

                                      case 2:
                                      case 'end':
                                        return _context2.stop();
                                    }
                                  }
                                }, _callee2, _this);
                              })));

                            case 18:
                              _context4.next = 20;
                              return _this.profileScope('Wait for animations', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                  while (1) {
                                    switch (_context3.prev = _context3.next) {
                                      case 0:
                                        _context3.next = 2;
                                        return new _promise2.default(function (resolve) {
                                          setTimeout(resolve, 5000); // max waiting time
                                          var timeout = setTimeout(resolve, 100);
                                          LayerTree.layerPainted(function () {
                                            clearTimeout(timeout);
                                            timeout = setTimeout(resolve, 100);
                                          });
                                        });

                                      case 2:
                                      case 'end':
                                        return _context3.stop();
                                    }
                                  }
                                }, _callee3, _this);
                              })));

                            case 20:
                              _context4.next = 22;
                              return Page.printToPDF(options);

                            case 22:
                              pdf = _context4.sent;
                              buff = Buffer.from(pdf.data, 'base64');


                              client.close();

                              resolve(buff);
                              _context4.next = 31;
                              break;

                            case 28:
                              _context4.prev = 28;
                              _context4.t0 = _context4['catch'](0);

                              reject(_context4.t0.message);

                            case 31:
                            case 'end':
                              return _context4.stop();
                          }
                        }
                      }, _callee4, _this, [[0, 28]]);
                    }));

                    return function (_x3) {
                      return _ref2.apply(this, arguments);
                    };
                  }());
                }));

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function renderPdf(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return renderPdf;
    }()
  }, {
    key: 'generatePdfOptions',
    value: function generatePdfOptions() {
      var options = {};

      if (this.options.landscape !== undefined) {
        options.landscape = !!this.options.landscape;
      }

      if (this.options.noMargins) {
        options.marginTop = 0;
        options.marginBottom = 0;
        options.marginLeft = 0;
        options.marginRight = 0;
      }

      if (this.options.includeBackground !== undefined) {
        options.printBackground = !!this.options.includeBackground;
      }

      if (this.options.paperWidth !== undefined) {
        options.paperWidth = parseFloat(this.options.paperWidth);
      }

      if (this.options.paperHeight !== undefined) {
        options.paperHeight = parseFloat(this.options.paperHeight);
      }

      if (this.options.pageRanges !== undefined) {
        options.pageRanges = this.options.pageRanges;
      }

      return options;
    }
  }, {
    key: 'error',
    value: function error() {
      if (this.options.printErrors) {
        var _console;

        (_console = console).error.apply(_console, arguments);
      }
    }
  }, {
    key: 'log',
    value: function log() {
      if (this.options.printLogs) {
        var _console2;

        (_console2 = console).log.apply(_console2, arguments);
      }
    }
  }, {
    key: 'cbToPromise',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(cb) {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', new _promise2.default(function (resolve, reject) {
                  cb(function (resp) {
                    resolve(resp);
                  });
                }));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function cbToPromise(_x4) {
        return _ref6.apply(this, arguments);
      }

      return cbToPromise;
    }()
  }, {
    key: 'getPerfTime',
    value: function getPerfTime(prev) {
      var time = process.hrtime(prev);
      return time[0] * 1e3 + time[1] / 1e6;
    }
  }, {
    key: 'profileScope',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(msg, cb) {
        var start;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                start = process.hrtime();
                _context7.next = 3;
                return cb();

              case 3:
                this.log(msg, 'took ' + Math.round(this.getPerfTime(start)) + 'ms');

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function profileScope(_x5, _x6) {
        return _ref7.apply(this, arguments);
      }

      return profileScope;
    }()
  }, {
    key: 'browserLog',
    value: function browserLog(type, msg) {
      var lines = msg.split('\n');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(lines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          this.log('(chrome) (' + type + ') ' + line);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'spawnChrome',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var _this2 = this;

        var chromeExec, commandLineOptions;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.t0 = this.options.chromeBinary;

                if (_context8.t0) {
                  _context8.next = 5;
                  break;
                }

                _context8.next = 4;
                return this.detectChrome();

              case 4:
                _context8.t0 = _context8.sent;

              case 5:
                chromeExec = _context8.t0;

                this.log('Using', chromeExec);
                commandLineOptions = ['--headless', '--remote-debugging-port=' + this.port, '--disable-gpu'].concat((0, _toConsumableArray3.default)(this.options.chromeOptions));


                if (this.commandLineOptions.windowSize !== undefined) {
                  commandLineOptions.push('--window-size=' + this.commandLineOptions.windowSize[0] + ',' + this.commandLineOptions.windowSize[1]);
                }
                this.chrome = cp.spawn(chromeExec, commandLineOptions);
                this.chrome.on('close', function (code) {
                  _this2.log('Chrome stopped (' + code + ')');
                  _this2.browserLog('out', _this2.chrome.stdout.toString());
                  _this2.browserLog('err', _this2.chrome.stderr.toString());
                });

              case 11:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function spawnChrome() {
        return _ref8.apply(this, arguments);
      }

      return spawnChrome;
    }()
  }, {
    key: 'connectToChrome',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (this.options.remoteHost) {
                  _context9.next = 3;
                  break;
                }

                _context9.next = 3;
                return this.spawnChrome();

              case 3:
                _context9.next = 5;
                return this.waitForDebugPort();

              case 5:
                return _context9.abrupt('return', _context9.sent);

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function connectToChrome() {
        return _ref9.apply(this, arguments);
      }

      return connectToChrome;
    }()
  }, {
    key: 'isCommandExists',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(cmd) {
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt('return', new _promise2.default(function (resolve, reject) {
                  commandExists(cmd, function (err, exists) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(exists);
                    }
                  });
                }));

              case 1:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function isCommandExists(_x7) {
        return _ref10.apply(this, arguments);
      }

      return isCommandExists;
    }()
  }, {
    key: 'detectChrome',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.isCommandExists('google-chrome-unstable');

              case 2:
                if (!_context11.sent) {
                  _context11.next = 4;
                  break;
                }

                return _context11.abrupt('return', 'google-chrome-unstable');

              case 4:
                _context11.next = 6;
                return this.isCommandExists('google-chrome-beta');

              case 6:
                if (!_context11.sent) {
                  _context11.next = 8;
                  break;
                }

                return _context11.abrupt('return', 'google-chrome-beta');

              case 8:
                _context11.next = 10;
                return this.isCommandExists('google-stable');

              case 10:
                if (!_context11.sent) {
                  _context11.next = 12;
                  break;
                }

                return _context11.abrupt('return', 'google-stable');

              case 12:
                _context11.next = 14;
                return this.isCommandExists('google-chrome');

              case 14:
                if (!_context11.sent) {
                  _context11.next = 16;
                  break;
                }

                return _context11.abrupt('return', 'google-chrome');

              case 16:
                _context11.next = 18;
                return this.isCommandExists('chromium');

              case 18:
                if (!_context11.sent) {
                  _context11.next = 20;
                  break;
                }

                return _context11.abrupt('return', 'chromium');

              case 20:
                _context11.next = 22;
                return this.isCommandExists('chromium-browser');

              case 22:
                if (!_context11.sent) {
                  _context11.next = 24;
                  break;
                }

                return _context11.abrupt('return', 'chromium-browser');

              case 24:
                _context11.next = 26;
                return this.isCommandExists('chrome');

              case 26:
                if (!_context11.sent) {
                  _context11.next = 28;
                  break;
                }

                return _context11.abrupt('return', 'chrome');

              case 28:
                _context11.next = 30;
                return this.isCommandExists('/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome');

              case 30:
                if (!_context11.sent) {
                  _context11.next = 32;
                  break;
                }

                return _context11.abrupt('return', '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome');

              case 32:
                _context11.next = 34;
                return this.isCommandExists('/Applications/Google\ Chrome\ Dev.app/Contents/MacOS/Google\ Chrome');

              case 34:
                if (!_context11.sent) {
                  _context11.next = 36;
                  break;
                }

                return _context11.abrupt('return', '/Applications/Google\ Chrome\ Dev.app/Contents/MacOS/Google\ Chrome');

              case 36:
                _context11.next = 38;
                return this.isCommandExists('/Applications/Google\ Chrome\ Beta.app/Contents/MacOS/Google\ Chrome');

              case 38:
                if (!_context11.sent) {
                  _context11.next = 40;
                  break;
                }

                return _context11.abrupt('return', '/Applications/Google\ Chrome\ Beta.app/Contents/MacOS/Google\ Chrome');

              case 40:
                _context11.next = 42;
                return this.isCommandExists('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome');

              case 42:
                if (!_context11.sent) {
                  _context11.next = 44;
                  break;
                }

                return _context11.abrupt('return', '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome');

              case 44:
                throw Error('Couldn\'t detect chrome version installed! use --chrome-binary to pass custom location');

              case 45:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function detectChrome() {
        return _ref11.apply(this, arguments);
      }

      return detectChrome;
    }()
  }, {
    key: 'killChrome',
    value: function killChrome() {
      if (!this.options.remoteHost) {
        this.chrome.kill(cp.SIGKILL);
      }
    }
  }, {
    key: 'waitForDebugPort',
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
        var _this3 = this;

        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt('return', new _promise2.default(function () {
                  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(resolve, reject) {
                    var timer;
                    return _regenerator2.default.wrap(function _callee12$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            _this3.log('Waiting for chrome to become available');

                            timer = setTimeout(function () {
                              reject(new Error('Chrome took too long to become available.'));
                            }, parseInt(_this3.options.timeout));

                          case 2:
                            if (!true) {
                              _context12.next = 19;
                              break;
                            }

                            _context12.prev = 3;
                            _context12.next = 6;
                            return _this3.isPortOpen(_this3.host, _this3.port);

                          case 6:
                            clearTimeout(timer);
                            _this3.log('Chrome port open!');
                            _context12.next = 10;
                            return _this3.checkChromeVersion();

                          case 10:
                            return _context12.abrupt('return', resolve());

                          case 13:
                            _context12.prev = 13;
                            _context12.t0 = _context12['catch'](3);
                            _context12.next = 17;
                            return _this3.wait(10);

                          case 17:
                            _context12.next = 2;
                            break;

                          case 19:
                          case 'end':
                            return _context12.stop();
                        }
                      }
                    }, _callee12, _this3, [[3, 13]]);
                  }));

                  return function (_x8, _x9) {
                    return _ref13.apply(this, arguments);
                  };
                }()));

              case 1:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function waitForDebugPort() {
        return _ref12.apply(this, arguments);
      }

      return waitForDebugPort;
    }()
  }, {
    key: 'checkChromeVersion',
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
        var _this4 = this;

        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt('return', new _promise2.default(function (resolve, reject) {
                  CDP({ host: _this4.host, port: _this4.port }, function () {
                    var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(client) {
                      var Browser, version;
                      return _regenerator2.default.wrap(function _callee14$(_context14) {
                        while (1) {
                          switch (_context14.prev = _context14.next) {
                            case 0:
                              _context14.prev = 0;
                              Browser = client.Browser;
                              _context14.next = 4;
                              return Browser.getVersion();

                            case 4:
                              version = _context14.sent;

                              if (version.product.search('/64.') !== -1) {
                                _this4.error('     ===== WARNING =====');
                                _this4.error('  Detected Chrome in version 64.x');
                                _this4.error('  This version is known to contain bug in remote api that prevents this tool to work');
                                _this4.error('  This issue is resolved in version 65');
                                _this4.error('  More info: https://github.com/Szpadel/chrome-headless-render-pdf/issues/22');
                              }
                              _this4.log('Connected to ' + version.product + ', protocol ' + version.protocolVersion);
                              _context14.next = 12;
                              break;

                            case 9:
                              _context14.prev = 9;
                              _context14.t0 = _context14['catch'](0);

                              _this4.error('Wasn\'t able to check chrome version, skipping compatibility check.');

                            case 12:
                              resolve();

                            case 13:
                            case 'end':
                              return _context14.stop();
                          }
                        }
                      }, _callee14, _this4, [[0, 9]]);
                    }));

                    return function (_x10) {
                      return _ref15.apply(this, arguments);
                    };
                  }()).on('error', function (e) {
                    reject(e);
                  });
                }));

              case 1:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function checkChromeVersion() {
        return _ref14.apply(this, arguments);
      }

      return checkChromeVersion;
    }()
  }, {
    key: 'isPortOpen',
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(host, port) {
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                return _context16.abrupt('return', new _promise2.default(function (resolve, reject) {
                  var connection = new net.Socket();
                  connection.connect({ host: host, port: port });
                  connection.on('connect', function () {
                    connection.end();
                    resolve();
                  });
                  connection.on('error', function () {
                    reject();
                  });
                }));

              case 1:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function isPortOpen(_x11, _x12) {
        return _ref16.apply(this, arguments);
      }

      return isPortOpen;
    }()
  }, {
    key: 'wait',
    value: function () {
      var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(ms) {
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                return _context17.abrupt('return', new _promise2.default(function (resolve) {
                  setTimeout(resolve, ms);
                }));

              case 1:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function wait(_x13) {
        return _ref17.apply(this, arguments);
      }

      return wait;
    }()
  }], [{
    key: 'generateSinglePdf',
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(url, filename, options) {
        var renderer, buff;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                renderer = new RenderPDF(options);
                _context18.next = 3;
                return renderer.connectToChrome();

              case 3:
                _context18.prev = 3;
                _context18.next = 6;
                return renderer.renderPdf(url, renderer.generatePdfOptions());

              case 6:
                buff = _context18.sent;

                fs.writeFileSync(filename, buff);
                renderer.log('Saved ' + filename);
                _context18.next = 14;
                break;

              case 11:
                _context18.prev = 11;
                _context18.t0 = _context18['catch'](3);

                renderer.error('error:', _context18.t0);

              case 14:
                renderer.killChrome();

              case 15:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[3, 11]]);
      }));

      function generateSinglePdf(_x14, _x15, _x16) {
        return _ref18.apply(this, arguments);
      }

      return generateSinglePdf;
    }()
  }, {
    key: 'generatePdfBuffer',
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(url, options) {
        var renderer;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                renderer = new RenderPDF(options);
                _context19.next = 3;
                return renderer.connectToChrome();

              case 3:
                _context19.prev = 3;
                _context19.next = 6;
                return renderer.renderPdf(url, renderer.generatePdfOptions());

              case 6:
                return _context19.abrupt('return', _context19.sent);

              case 9:
                _context19.prev = 9;
                _context19.t0 = _context19['catch'](3);

                renderer.error('error:', _context19.t0);

              case 12:
                _context19.prev = 12;

                renderer.killChrome();
                return _context19.finish(12);

              case 15:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this, [[3, 9, 12, 15]]);
      }));

      function generatePdfBuffer(_x17, _x18) {
        return _ref19.apply(this, arguments);
      }

      return generatePdfBuffer;
    }()
  }, {
    key: 'generateMultiplePdf',
    value: function () {
      var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(pairs, options) {
        var renderer, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, job, buff;

        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                renderer = new RenderPDF(options);
                _context20.next = 3;
                return renderer.connectToChrome();

              case 3:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context20.prev = 6;
                _iterator2 = (0, _getIterator3.default)(pairs);

              case 8:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context20.next = 24;
                  break;
                }

                job = _step2.value;
                _context20.prev = 10;
                _context20.next = 13;
                return renderer.renderPdf(job.url, renderer.generatePdfOptions());

              case 13:
                buff = _context20.sent;

                fs.writeFileSync(job.pdf, buff);
                renderer.log('Saved ' + job.pdf);
                _context20.next = 21;
                break;

              case 18:
                _context20.prev = 18;
                _context20.t0 = _context20['catch'](10);

                renderer.error('error:', _context20.t0);

              case 21:
                _iteratorNormalCompletion2 = true;
                _context20.next = 8;
                break;

              case 24:
                _context20.next = 30;
                break;

              case 26:
                _context20.prev = 26;
                _context20.t1 = _context20['catch'](6);
                _didIteratorError2 = true;
                _iteratorError2 = _context20.t1;

              case 30:
                _context20.prev = 30;
                _context20.prev = 31;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 33:
                _context20.prev = 33;

                if (!_didIteratorError2) {
                  _context20.next = 36;
                  break;
                }

                throw _iteratorError2;

              case 36:
                return _context20.finish(33);

              case 37:
                return _context20.finish(30);

              case 38:
                renderer.killChrome();

              case 39:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this, [[6, 26, 30, 38], [10, 18], [31,, 33, 37]]);
      }));

      function generateMultiplePdf(_x19, _x20) {
        return _ref20.apply(this, arguments);
      }

      return generateMultiplePdf;
    }()
  }]);
  return RenderPDF;
}();

module.exports = RenderPDF;
module.exports.default = RenderPDF;