'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _webworkerThreads = require('webworker-threads');

var _webworkerThreads2 = _interopRequireDefault(_webworkerThreads);

var _genericPool = require('generic-pool');

var _genericPool2 = _interopRequireDefault(_genericPool);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Worker = _webworkerThreads2.default.Worker;

var createPool = function createPool(funct) {
    var execString = '\n        this.onmessage = (event) => {\n            const data = (' + funct.toString() + ')(event.data.data);\n            const id = event.data.id;\n            postMessage({id, data});\n        };\n    ';

    var create = function create() {
        var w = new Worker(new Function(execString));
        return w;
    };

    var destroy = function destroy(w) {
        w.terminate();
    };

    var pool = _genericPool2.default.createPool({ create: create, destroy: destroy }, { min: 2, max: 8, autostart: false });

    pool.use = function (data) {
        var id = (0, _v2.default)();
        return pool.acquire().then(function (w) {
            return new _bluebird2.default(function (resolve) {
                w.postMessage({ id: id, data: data });
                w.onmessage = function (e) {
                    if (e.data.id === id) resolve(e.data.data);
                    pool.release(w);
                };
            });
        });
    };

    return pool;
};

exports.default = createPool;