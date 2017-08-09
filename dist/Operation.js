'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Graph = require('Graph');

var _Graph2 = _interopRequireDefault(_Graph);

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

var ancestorExportsDep = function ancestorExportsDep(graph, dep) {
    if (graph.exportTypes.includes(dep)) return graph;
    if (graph.children.length === 0) return false;
    return _lodash2.default.some(graph.children.map(function (child) {
        return ancestorExportsDep(child, dep);
    }));
};

Operations.createOperation = function (name, deps, exportTypes, opfunc) {
    if ((typeof exportTypes === 'undefined' ? 'undefined' : _typeof(exportTypes)) !== 'object') exportTypes = [exportTypes];

    var OpBuilder = function OpBuilder() {
        var Operation = function Operation() {
            var _this = this;

            for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
                options[_key] = arguments[_key];
            }

            this.graph = new _Graph2.default();
            this.node = this.graph.Node(function (d) {
                return _bluebird2.default.resolve(opfunc.apply(undefined, [d].concat(options))).then(function (op_values) {
                    // If there are multiple return values, grab each and add it to the data object
                    if (exportTypes.length > 1) {
                        exportTypes.forEach(function (type, i) {
                            data = addReturn(data, type, op_values[i]);
                        });
                    } else {
                        var type = exportTypes[0];
                        data = addReturn(data, type, op_values);
                    }
                });
            });
            this.name = name;
            this.exportTypes = exportTypes;
            this.dependencies = deps;

            this.backfill = function (node) {
                node.dependencies.forEach(function (dep) {
                    if (!ancestorExportsDep(_this, dep)) {
                        // TODO: This needs to be chosen in a smarter way.
                        // Perhaps I should choose the operation with the minimum depth sub-graph
                        var op_name = ExportTypes[dep][0];
                        var op = new Operations[op_name]();
                        _this.backfill(op);
                        _this.graph.connect(op.node, node.node);
                    }
                });
            };
            this.addChild = function (node) {
                node.graph = _this.graph;
                _this.graph.connect(_this.node, node.node);
                // This is where I need to resolve inferred in-between nodes
                _this.backfill(node);
            };
            this.and = function (NextOpClass) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                var Op = new (Function.prototype.bind.apply(NextOpClass, [null].concat(args)))();
                _this.addChild(Op);
                return Op;
            };

            this.execute = this.graph.execute;
        };

        return new Operation();

        /* Calculate dependency values
        ** If dependency is met, return a resolved promise
        */
        // const prior_promises = deps.map((dep) => {
        //     if (!data[dep]) {
        //         // Dependency not met
        //         const allPriors = ExportTypes[dep].map((depName) => {
        //             return Operations[depName](data);
        //         });

        //         return Promise.any(allPriors);
        //     }
        //     return Promise.resolve();
        // });

        // Once all dependencies have been computed, perform this operation
        // return Promise.all(prior_promises).then(() => {
        //     return opfunc(data, ...args);
        // }).then((op_values) => {
        //     // If there are multiple return values, grab each and add it to the data object
        //     if (exportTypes.length > 1) {
        //         exportTypes.forEach((type, i) => {
        //             data = addReturn(data, type, op_values[i]);
        //         });
        //     } else {
        //         const type = exportTypes[0];
        //         data = addReturn(data, type, op_values);
        //     }

        //     return data;
        // })
        // // One of the dependencies failed.
        // .tapCatch((err) => {
        //     console.log('Dependency error', err);
        // });
    };

    Operations[name] = OpBuilder;
    exportTypes.forEach(function (type) {
        ExportTypes[type] ? ExportTypes[type].push(name) : ExportTypes[type] = [name];
    });

    return OpBuilder;
};

exports.default = Operations;