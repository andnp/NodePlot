"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var dims = function dims(matrix) {
    var rows = matrix.length;
    var cols = matrix[0].length;
    return { rows: rows, cols: cols };
};

var forEach = function forEach(matrix, f) {
    var _dims = dims(matrix),
        rows = _dims.rows,
        cols = _dims.cols;

    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
            f(matrix[i][j], i, j);
        }
    }
};

var makeArray = function makeArray(size) {
    var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var array = [];
    for (var i = 0; i < size; ++i) {
        array.push(v);
    }
    return array;
};

var iterateColumns = function iterateColumns(matrix, f) {
    var _dims2 = dims(matrix),
        rows = _dims2.rows,
        cols = _dims2.cols;

    for (var j = 0; j < cols; ++j) {
        var col = [];
        for (var i = 0; i < rows; ++i) {
            col.push(matrix[i][j]);
        }
        f(col);
    }
};

var iterateRows = function iterateRows(matrix, f) {
    var _dims3 = dims(matrix),
        rows = _dims3.rows,
        cols = _dims3.cols;

    for (var i = 0; i < rows; ++i) {
        var row = [];
        for (var j = 0; j < cols; ++j) {
            row.push(matrix[i][j]);
        }
        f(row);
    }
};

var transpose = function transpose(matrix) {
    var trans = [];

    var _dims4 = dims(matrix),
        rows = _dims4.rows,
        cols = _dims4.cols;

    for (var j = 0; j < cols; ++j) {
        var col = [];
        for (var i = 0; i < rows; ++i) {
            col.push(matrix[i][j]);
        }
        trans.push(col);
    }
    return trans;
};

exports.default = {
    dims: dims,
    forEach: forEach,
    makeArray: makeArray,
    iterateColumns: iterateColumns,
    iterateRows: iterateRows,
    transpose: transpose
};