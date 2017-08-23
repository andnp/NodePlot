'use strict';

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Operation2.default.createOperation('LinePlot', ['array'], 'chart', async function (data) {
    var static_name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'line_plot';

    var array = data.array;
    var name = data.name || static_name;

    var trace = {
        type: 'scatter', // set the chart type
        mode: 'lines', // connect points with lines
        x: _lodash2.default.times(array.length, function (i) {
            return i;
        }),
        y: array,
        line: { // set the width of the line.
            width: 1
        }
    };

    var layout = {
        yaxis: { title: "Chart Title!!" }, // set the y axis title
        xaxis: {
            showgrid: false // remove the x-axis grid lines
        },
        margin: { // update the left, bottom, right, top margin
            l: 40, b: 40, r: 40, t: 40
        }
    };

    return {
        trace: trace,
        layout: layout,
        name: name
    };
});