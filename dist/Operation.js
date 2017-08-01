'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Operations = {};
var ExportTypes = {};

var addReturn = function addReturn(data, type, ret) {
    if (type === '') return;
    if (type === 'chart') {
        if (_lodash2.default.isUndefined(data[type])) data[type] = [];
        data[type].push(ret);
    } else if (type === 'map') {
        data = {};
        data.map = ret;
    } else {
        data[type] = ret;
    }

    return data;
};

Operations.createOperation = function (name, deps, exportTypes, opfunc) {
    if ((typeof exportTypes === 'undefined' ? 'undefined' : _typeof(exportTypes)) !== 'object') exportTypes = [exportTypes];

    var operation = function operation(data) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var prior_promises = deps.map(function (dep) {
            if (!data[dep]) {
                // Dependency not met
                var allPriors = ExportTypes[dep].map(function (depName) {
                    return Operations[depName](data);
                });

                return _bluebird2.default.any(allPriors);
            }
            return _bluebird2.default.resolve();
        });

        // Once all dependencies have been computed, perform this operation
        return _bluebird2.default.all(prior_promises).then(function () {
            return opfunc.apply(undefined, [data].concat(args));
        }).then(function (op_values) {
            // If there are multiple return values, grab each and add it to the data object
            if (exportTypes.length > 1) {
                exportTypes.forEach(function (type, i) {
                    data = addReturn(data, type, op_values[i]);
                });
            } else {
                var type = exportTypes[0];
                data = addReturn(data, type, op_values);
            }

            return data;
        })
        // One of the dependencies failed.
        .tapCatch(function (err) {
            console.log('Dependency error', err);
        });
    };

    operation.dependencies = deps;

    Operations[name] = operation;
    exportTypes.forEach(function (type) {
        ExportTypes[type] ? ExportTypes[type].push(name) : ExportTypes[type] = [name];
    });

    return operation;
};

exports.default = Operations;