'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _phantomPool = require('phantom-pool');

var _phantomPool2 = _interopRequireDefault(_phantomPool);

var _imageDataUri = require('image-data-uri');

var _imageDataUri2 = _interopRequireDefault(_imageDataUri);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plotly = require.resolve('plotly.js/dist/plotly.min.js');
var d3 = require.resolve('d3/d3.min.js');

var phantomPool = (0, _phantomPool2.default)({
    max: 8,
    min: 2,
    maxUses: 200,
    autostart: false
});

var plot = async function plot(trace, layout, options) {
    var url = await phantomPool.use(async function (instance) {
        var page = await instance.createPage();
        await page.injectJs(d3);
        await page.injectJs(plotly);

        var outObj = instance.createOutObject();
        // outObj.data_url = '';
        page.property('onCallback', function (data, out) {
            if (data) out.data_url = data;
        }, outObj);

        await page.evaluate(function (trace, layout) {
            var el = document.createElement('div');
            document.body.appendChild(el);

            return Plotly.plot(el, [trace], layout, { showLink: false }).then(function (gd) {
                return Plotly.toImage(gd, { format: 'png', height: 800, width: 800 });
            }).then(function (url) {
                window.callPhantom(url);
            });
        }, trace, layout);

        await _bluebird2.default.delay(5000);
        var url = await outObj.property('data_url');
        return url;
    });

    var file = options.path + '/' + options.name + '.png';
    _imageDataUri2.default.outputFile(url, file);
    return file;
};

process.on('exit', function () {
    phantomPool.drain().then(function () {
        return pool.clear();
    });
});

exports.default = {
    plot: plot
};