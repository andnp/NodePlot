'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _MatrixUtils = require('./utils/MatrixUtils');

var _MatrixUtils2 = _interopRequireDefault(_MatrixUtils);

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Operation2.default.createOperation('Map', ['map'], 'map', function (data, op) {
    var array = data.map;
    var promises = array.map(function (dat) {
        return op(dat);
    });
    return _bluebird2.default.all(promises);
});

_Operation2.default.createOperation('AppendColumn', ['map'], ['matrix', 'rows', 'cols'], function (data) {
    var array = data.map;
    var matrix = [];
    array.forEach(function (d) {
        _MatrixUtils2.default.iterateColumns(d.matrix, function (col) {
            return matrix.push(col);
        });
    });

    var trans = _MatrixUtils2.default.transpose(matrix);

    var _MatDash$dims = _MatrixUtils2.default.dims(trans),
        rows = _MatDash$dims.rows,
        cols = _MatDash$dims.cols;

    return [trans, rows, cols];
});

_Operation2.default.createOperation('AppendRow', ['map'], ['matrix', 'rows', 'cols'], function (data) {
    var array = data.map;
    var matrix = [];
    array.forEach(function (d) {
        _MatrixUtils2.default.iterateRows(d.matrix, function (row) {
            return matrix.push(row);
        });
    });

    var _MatDash$dims2 = _MatrixUtils2.default.dims(matrix),
        rows = _MatDash$dims2.rows,
        cols = _MatDash$dims2.cols;

    return [matrix, rows, cols];
});