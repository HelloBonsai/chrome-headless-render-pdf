#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('Starting PDF rendering');

var RenderPDF = require('../index');
var argv = require('minimist')(process.argv.slice(2), {
    string: ['url', 'pdf', 'chrome-binary', 'chrome-option', 'remote-host', 'remote-port', 'window-size', 'paper-width', 'paper-height', 'page-ranges', 'timeout'],
    boolean: ['no-margins', 'include-background', 'landscape ']
});

if (argv['help'] || !argv['pdf'] || !argv['url']) {
    printHelp();
    process.exit(2);
}

var urls = typeof argv['url'] === 'string' ? [argv['url']] : argv['url'];
var pdfs = typeof argv['pdf'] === 'string' ? [argv['pdf']] : argv['pdf'];

var windowSize = void 0;
if (typeof argv['window-size'] === 'string') {
    windowSize = argv['window-size'].match(/^([0-9]+)[,x*]([0-9]+)$/);
    if (windowSize === null) {
        console.error('ERROR: Missing or bad input for --window-size \n');
        printHelp();
        process.exit(1);
    }
    windowSize = windowSize.splice(1, 3);
}

if (pdfs.length !== urls.length) {
    console.error('ERROR: Unpaired --url or --pdf found\n');
    printHelp();
    process.exit(1);
}

var chromeBinary = null;
if (typeof argv['chrome-binary'] === 'string') {
    chromeBinary = argv['chrome-binary'];
}

var chromeOptions = undefined;
if (Array.isArray(argv['chrome-option'])) {
    chromeOptions = argv['chrome-option'];
} else if (typeof argv['chrome-option'] === 'string') {
    chromeOptions = [argv['chrome-option']];
}

var remoteHost = undefined,
    remotePort = undefined;

if (typeof argv['remote-host'] === 'string') {
    remoteHost = argv['remote-host'];
}
if (typeof argv['remote-port'] === 'string') {
    remotePort = argv['remote-port'];
}

var paperWidth = undefined;
if (typeof argv['paper-width'] === 'string') {
    paperWidth = argv['paper-width'];
}

var paperHeight = undefined;
if (typeof argv['paper-height'] === 'string') {
    paperHeight = argv['paper-height'];
}

var landscape = void 0;
if (argv['landscape']) {
    landscape = true;
}

var noMargins = void 0;
if (argv['margins'] !== undefined) {
    noMargins = !argv['margins'];
}

var includeBackground = void 0;
if (argv['include-background']) {
    includeBackground = true;
}

var pageRanges = void 0;
if (typeof argv['page-ranges'] === 'string') {
    pageRanges = argv['page-ranges'];
}

var timeout = void 0;
if (typeof argv['timeout'] === 'string') {
    timeout = argv['timeout'];
}

(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var timeoutTimer, jobs;
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.prev = 0;
                    timeoutTimer = void 0;


                    if (timeout) {
                        timeoutTimer = setTimeout(function () {
                            throw new Error('process timed out');
                        }, parseInt(timeout));
                    }

                    jobs = generateJobList(urls, pdfs);
                    _context.next = 6;
                    return RenderPDF.generateMultiplePdf(jobs, {
                        printLogs: true,
                        landscape: landscape,
                        noMargins: noMargins,
                        includeBackground: includeBackground,
                        chromeBinary: chromeBinary,
                        chromeOptions: chromeOptions,
                        remoteHost: remoteHost,
                        remotePort: remotePort,
                        windowSize: windowSize,
                        paperWidth: paperWidth,
                        paperHeight: paperHeight,
                        pageRanges: pageRanges,
                        timeout: timeout
                    });

                case 6:

                    if (timeoutTimer) {
                        clearTimeout(timeoutTimer);
                    }
                    _context.next = 13;
                    break;

                case 9:
                    _context.prev = 9;
                    _context.t0 = _context['catch'](0);

                    console.error(_context.t0);
                    process.exit(1);

                case 13:

                    process.exit();

                case 14:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, undefined, [[0, 9]]);
}))();

function generateJobList(urls, pdfs) {
    var jobs = [];
    for (var j = 0; j < urls.length; j++) {
        jobs.push({
            url: urls[j],
            pdf: pdfs[j]
        });
    }
    return jobs;
}

function printHelp() {
    console.log('chrome-headless-render-pdf [OPTIONS] --url=URL --pdf=OUTPUT-FILE [--url=URL2 --pdf=OUTPUT-FILE2] ...');
    console.log('  Options:');
    console.log('    --help                   this screen');
    console.log('    --url                    url to load, for local files use: file:///path/to/file');
    console.log('    --pdf                    output for generated file can be relative to current directory');
    console.log('    --chrome-binary          set chrome location (use this options when autodetection fail)');
    console.log('    --chrome-option          set chrome option, can be used multiple times, e.g. --chrome-option=--no-sandbox');
    console.log('    --remote-host            set chrome host (for remote process)');
    console.log('    --remote-port            set chrome port (for remote process)');
    console.log('    --no-margins             disable default 1cm margins');
    console.log('    --include-background     include elements background');
    console.log('    --landscape              generate pdf in landscape orientation');
    console.log('    --window-size            specify window size, width(,x*)height (e.g. --window-size 1600,1200 or --window-size 1600x1200)');
    console.log('    --paper-width            specify page width in inches (defaults to 8.5 inches)');
    console.log('    --paper-height           specify page height in inches (defaults to 11 inches)');
    console.log('    --page-ranges            specify pages to render default all pages,  e.g. 1-5, 8, 11-13');
    console.log('    --timeout                sets the max time the process is going to wait before exiting in ms (e.g --timeout 10000)');
    console.log('');
    console.log('  Example:');
    console.log('    Render single pdf file');
    console.log('      chrome-headless-render-pdf --url http://google.com --pdf test.pdf');
    console.log('    Render pdf from local file');
    console.log('      chrome-headless-render-pdf --url file:///tmp/example.html --pdf test.pdf');
    console.log('    Render multiple pdf files');
    console.log('      chrome-headless-render-pdf --url http://google.com --pdf test.pdf --url file:///tmp/example.html --pdf test.pdf');
}