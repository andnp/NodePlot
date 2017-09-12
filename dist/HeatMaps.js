'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Operation2.default.createOperation('HeatMap', ['matrix'], 'chart', async function (data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var matrix = data.matrix;
    var name = data.name || options.static_name || 'heatmap_plot';

    var trace = (0, _assign2.default)({
        type: 'heatmap',
        z: matrix
    }, options);

    var layout = {
        title: name,
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