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

var _Operation = require('./Operation');

var _Operation2 = _interopRequireDefault(_Operation);

var _MatrixUtils = require('./utils/MatrixUtils');

var _MatrixUtils2 = _interopRequireDefault(_MatrixUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFilePromise = _bluebird2.default.promisify(_fs2.default.readFile);
var writeFilePromise = _bluebird2.default.promisify(_fs2.default.writeFile);
var csvParse = _bluebird2.default.promisify(_csv2.default.parse);
var globPromise = _bluebird2.default.promisify(_glob2.default);

_Operation2.default.createOperation('FileLoader', [], 'raw', function (data) {
    return readFilePromise(data.location);
});

_Operation2.default.createOperation('CSVReader', ['raw'], 'raw_set', function (data) {
    return csvParse(data.raw, {
        auto_parse: true,
        trim: true
        // filter out any artifacts due to trailing commas
    }).then(function (csv_matrix) {
        var _MatDash$dims = _MatrixUtils2.default.dims(csv_matrix),
            rows = _MatDash$dims.rows,
            cols = _MatDash$dims.cols;

        var mat = [];
        for (var i = 0; i < rows; ++i) {
            var row = [];
            for (var j = 0; j < cols; ++j) {
                if (!(j === cols - 1 && csv_matrix[i][j] === '')) row.push(csv_matrix[i][j]);
            }
            mat.push(row);
        }
        return mat;
    });
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

_Operation2.default.createOperation('WriteCSV', ['matrix'], '', async function (data, file) {
    var str = '';
    var matrix = data.matrix;

    var _MatDash$dims2 = _MatrixUtils2.default.dims(matrix),
        rows = _MatDash$dims2.rows,
        cols = _MatDash$dims2.cols;

    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
            str += '' + matrix[i][j] + (j === cols - 1 ? '' : ',');
        }
        str += '\n';
    }

    return writeFilePromise(file, str);
});