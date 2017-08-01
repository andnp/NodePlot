'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _phantom = require('phantom');

var _phantom2 = _interopRequireDefault(_phantom);

var _imageDataUri = require('image-data-uri');

var _imageDataUri2 = _interopRequireDefault(_imageDataUri);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plot = async function plot(trace, layout, name) {
    var instance = await _phantom2.default.create();
    var page = await instance.createPage();
    await page.injectJs(require.resolve('d3/d3.min.js'));
    await page.injectJs(require.resolve('plotly.js/dist/plotly.min.js'));

    var outObj = instance.createOutObject();
    outObj.data_url = '';
    page.property('onCallback', function (data, out) {
        out.data_url = data;
    }, outObj);

    await page.evaluate(function (trace, layout) {
        var el = document.createElement('div');
        document.body.appendChild(el);

        Plotly.plot(el, [trace], layout, { showLink: false }).then(function (gd) {
            return Plotly.toImage(gd, { format: 'png', height: 800, width: 800 });
        }).then(function (url) {
            window.callPhantom(url);
        });
    }, trace, layout);

    var url = await outObj.property('data_url');
    await instance.exit();

    _imageDataUri2.default.outputFile(url, 'plots/' + name + '.png');
};

exports.default = {
    plot: plot
};