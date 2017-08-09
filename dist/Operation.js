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
    } else {
        data[type] = ret;
    }

    return data;
};

// const ancestorExportsDep = (graph, dep) => {
//     if (graph.exportTypes.includes(dep)) return graph;
//     if (graph.children.length === 0) return false;
//     return _.some(graph.children.map((child) => ancestorExportsDep(child, dep)));
// };

Operations.createOperation = function (name, deps, exportTypes, opfunc) {
    if ((typeof exportTypes === 'undefined' ? 'undefined' : _typeof(exportTypes)) !== 'object') exportTypes = [exportTypes];

    var OpBuilder = function OpBuilder() {
        for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
            options[_key] = arguments[_key];
        }

        var Operation = function Operation() {
            var _this = this;

            this.graph = new _Graph2.default();
            this.node = this.graph.Node(function (d) {
                return _bluebird2.default.resolve(opfunc.apply(undefined, [d].concat(options))).then(function (op_values) {
                    // If there are multiple return values, grab each and add it to the data object
                    if (exportTypes.length > 1) {
                        exportTypes.forEach(function (type, i) {
                            d = addReturn(d, type, op_values[i]);
                        });
                    } else {
                        var type = exportTypes[0];
                        d = addReturn(d, type, op_values);
                    }
                    return d;
                });
            });
            this.name = name;
            this.exportTypes = exportTypes;
            this.dependencies = deps;

            // this.backfill = (node) => {
            //     node.dependencies.forEach((dep) => {
            //         if (!ancestorExportsDep(this, dep)) {
            //             // TODO: This needs to be chosen in a smarter way.
            //             // Perhaps I should choose the operation with the minimum depth sub-graph
            //             const op_name = ExportTypes[dep][0];
            //             const op = new Operations[op_name]();
            //             this.backfill(op);
            //             this.graph.connect(op.node, node.node);
            //         }
            //     });
            // };
            this.addChild = function (node) {
                node.graph = _this.graph;
                _this.graph.connect(_this.node, node.node);
                // This is where I need to resolve inferred in-between nodes
                // this.backfill(node);
            };
            this.and = function (NextOpClass) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                var Op = NextOpClass.apply(undefined, args);
                _this.addChild(Op);
                return Op;
            };

            this.execute = function (data) {
                return _this.graph.execute(data);
            };
        };

        return new Operation();
    };

    Operations[name] = OpBuilder;
    exportTypes.forEach(function (type) {
        ExportTypes[type] ? ExportTypes[type].push(name) : ExportTypes[type] = [name];
    });

    return OpBuilder;
};

exports.default = Operations;