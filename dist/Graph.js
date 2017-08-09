'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Node = function Node(funct) {
    var _this = this;

    this.id = (0, _v2.default)();
    this.outs = {};

    this.addOutput = function (node) {
        _this.outs[node.id] = node;
    };
    this.removeOutput = function (node) {
        delete _this.outs[node.id];
    };

    var executeChildren = function executeChildren(d, visited_nodes) {
        var promises = [];
        _lodash2.default.forOwn(_this.outs, function (child) {
            var child_promise = child.execute(d, visited_nodes);
            promises.push(child_promise);
        });
        return _bluebird2.default.all(promises);
    };
    this.execute = function (d, visited_nodes) {
        if (visited_nodes.includes(_this.id)) return _bluebird2.default.resolve(d);
        visited_nodes.push(_this.id);
        // Cast output of funct to a promise (regardless of if it was a promise originally)
        var promise = _bluebird2.default.resolve(funct(d)).then(function () {
            return executeChildren(d, visited_nodes);
        });
        return promise;
    };
};

var Graph = function Graph() {
    var _this2 = this;

    this.entry;
    this.nodes = {};
    this.Node = function (funct) {
        var n = new Node(funct);
        // Defines the first created node as the entry point
        if (!_this2.entry) _this2.entry = n;
        _this2.nodes[n.id] = n;
        return n;
    };

    // Connects output of n1 to input of n2
    this.connect = function (n1, n2) {
        n1.addOutput(n2);
    };

    this.insertBetween = function (n1, n2, n3) {
        n1.removeOutput(n3);
        n1.addOutput(n2);
        n2.addOutput(n3);
    };

    this.execute = function (d) {
        var visited_nodes = [];
        return _this2.entry.execute(d, visited_nodes).then(function () {
            return d;
        });
    };
};

exports.default = Graph;