'use strict';

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

var _MatrixUtils = require('./utils/MatrixUtils');

var _MatrixUtils2 = _interopRequireDefault(_MatrixUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Operation2.default.createOperation('HorizontalAverage', ['matrix', 'rows', 'cols'], 'array', function (data) {
    var matrix = data.matrix,
        rows = data.rows,
        cols = data.cols;

    var rowVals = _MatrixUtils2.default.makeArray(rows);
    _MatrixUtils2.default.forEach(matrix, function (m, i) {
        rowVals[i] += m;
    });

    var avgs = rowVals.map(function (row) {
        return row / cols;
    });
    return avgs;
});

_Operation2.default.createOperation('VerticalAverage', ['matrix', 'rows', 'cols'], 'array', function (data) {
    var matrix = data.matrix,
        rows = data.rows,
        cols = data.cols;

    var colVals = _MatrixUtils2.default.makeArray(cols);
    _MatrixUtils2.default.forEach(matrix, function (m, i_, j) {
        colVals[j] += m;
    });

    var avgs = colVals.map(function (col) {
        return col / rows;
    });
    return avgs;
});