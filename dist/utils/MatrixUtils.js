"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var forEach = function forEach(matrix, f) {
    var rows = matrix.length;
    var cols = matrix[0].length;
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
    var rows = matrix.length;
    var cols = matrix[0].length;
    for (var j = 0; j < cols; ++j) {
        var col = [];
        for (var i = 0; i < rows; ++i) {
            col.push(matrix[i][j]);
        }
        f(col);
    }
};

var iterateRows = function iterateRows(matrix, f) {
    var rows = matrix.length;
    var cols = matrix[0].length;
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
    var rows = matrix.length;
    var cols = matrix[0].length;
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
    forEach: forEach,
    makeArray: makeArray,
    iterateColumns: iterateColumns,
    iterateRows: iterateRows,
    transpose: transpose
};