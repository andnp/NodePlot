'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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

var _Worker = require('./utils/Worker');

var _Worker2 = _interopRequireDefault(_Worker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFilePromise = _bluebird2.default.promisify(_fs2.default.readFile);
var writeFilePromise = _bluebird2.default.promisify(_fs2.default.writeFile);
var globPromise = _bluebird2.default.promisify(_glob2.default);

_Operation2.default.createOperation('FileLoader', [], 'raw', function (data) {
    return readFilePromise(data.location);
});

var parseCsvString = function parseCsvString(str) {
    var rows = str.split('\n');
    var mat = [];
    for (var i = 0; i < rows.length; ++i) {
        var cols = rows[i].split(',');
        if (cols.length === 1 && cols[0] === '') continue;
        var row = [];
        for (var j = 0; j < cols.length; ++j) {
            if (!(j === cols.length - 1 && cols[j] === '')) row.push(parseFloat(cols[j]));
        }
        mat.push(row);
    }
    return mat;
};
var CSVParsePool = (0, _Worker2.default)(parseCsvString);

_Operation2.default.createOperation('CSVReader', ['raw'], 'matrix', function (data) {
    var buffer = data.raw;
    var str = buffer.toString();
    return CSVParsePool.use(str);
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

    var _MatDash$dims = _MatrixUtils2.default.dims(matrix),
        rows = _MatDash$dims.rows,
        cols = _MatDash$dims.cols;

    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
            str += '' + matrix[i][j] + (j === cols - 1 ? '' : ',');
        }
        str += '\n';
    }

    return writeFilePromise(file, str);
});