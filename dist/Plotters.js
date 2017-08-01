'use strict';

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

var _LocalPlotter = require('./plotters/LocalPlotter');

var _LocalPlotter2 = _interopRequireDefault(_LocalPlotter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Operation2.default.createOperation('SavePNG', ['chart'], '', async function (data) {
    var promises = data.chart.map(function (chart) {
        return _LocalPlotter2.default.plot(chart.trace, chart.layout, chart.name);
    });

    await Promise.all(promises);
});