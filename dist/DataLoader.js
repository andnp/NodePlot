'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _csv = require('csv');

var _csv2 = _interopRequireDefault(_csv);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _Operation = require('Operation');

var _Operation2 = _interopRequireDefault(_Operation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFilePromise = _bluebird2.default.promisify(_fs2.default.readFile);
var csvParse = _bluebird2.default.promisify(_csv2.default.parse);
var globPromise = _bluebird2.default.promisify(_glob2.default);

_Operation2.default.createOperation('FileLoader', [], 'raw', function (data) {
    return readFilePromise(data.location);
});

_Operation2.default.createOperation('CSVReader', ['raw'], 'raw_set', function (data) {
    return csvParse(data.raw);
});

_Operation2.default.createOperation('NumericMatrix', ['raw_set'], ['matrix', 'rows', 'cols'], function (data) {
    var matrix = data.raw_set;
    var newMatrix = [];
    var rows = matrix.length;
    var cols = matrix[0].length;
    for (var i = 0; i < rows; ++i) {
        var rowdat = [];
        for (var j = 0; j < cols; ++j) {
            rowdat.push(parseFloat(matrix[i][j]));
        }
        newMatrix.push(rowdat);
    }
    return [newMatrix, rows, cols];
});

_Operation2.default.createOperation('ReadGlob', [], 'map', async function (data) {
    var glob = data.location;

    var files = await globPromise(glob);
    return files.map(function (file) {
        var obj = _lodash2.default.cloneDeep(data);
        obj.location = file;
        return obj;
    });
});