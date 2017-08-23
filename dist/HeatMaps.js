'use strict';

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Operation2.default.createOperation('HeatMap', ['matrix'], 'chart', async function (data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var matrix = data.matrix;
    var name = data.name || options.static_name || 'heatmap_plot';

    var trace = Object.assign({
        type: 'heatmap',
        z: matrix
    }, options);

    var layout = {
        title: 'Chart Title',
        yaxis: {
            ticks: ''
        },
        xaxis: {
            ticks: ''
        },
        margin: {
            l: 40, b: 40, r: 40, t: 40
        }
    };

    return {
        trace: trace,
        layout: layout,
        name: name
    };
});