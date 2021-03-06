'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

var _LocalPlotter = require('./plotters/LocalPlotter');

var _LocalPlotter2 = _interopRequireDefault(_LocalPlotter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Operation2.default.createOperation('SavePNG', ['chart'], 'pngs', async function (data, options) {
    var promises = data.chart.map(function (chart) {
        return _LocalPlotter2.default.plot(chart.trace, chart.layout, { name: chart.name, path: options.path });
    });

    await _promise2.default.all(promises);
});