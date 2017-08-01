'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _MatrixUtils = require('utils/MatrixUtils');

var _MatrixUtils2 = _interopRequireDefault(_MatrixUtils);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Operation = require('Operation');

var _Operation2 = _interopRequireDefault(_Operation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Operation2.default.createOperation('Map', ['map'], 'map', function (data, op) {
    var array = data.map;
    var promises = array.map(function (dat) {
        return op(dat);
    });
    return _bluebird2.default.all(promises);
});

_Operation2.default.createOperation('AppendColumn', ['map'], 'matrix', function (data) {
    var array = data.map;
    var matrix = [];
    array.forEach(function (d) {
        _MatrixUtils2.default.iterateColumns(d.matrix, function (col) {
            return matrix.push(col);
        });
    });

    var trans = _MatrixUtils2.default.transpose(matrix);
    return trans;
});

_Operation2.default.createOperation('AppendRow', ['map'], 'matrix', function (data) {
    var array = data.map;
    var matrix = [];
    array.forEach(function (d) {
        _MatrixUtils2.default.iterateRows(d.matrix, function (row) {
            return matrix.push(row);
        });
    });

    return matrix;
});