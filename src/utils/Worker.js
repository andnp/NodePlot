import Threads from 'webworker-threads';
import Pool from 'generic-pool';
import uuid from 'uuid/v4';
import Promise from 'bluebird';

const Worker = Threads.Worker;

const createPool = (funct) => {
    const execString = `
        this.onmessage = (event) => {
            const data = (${funct.toString()})(event.data.data);
            const id = event.data.id;
            postMessage({id, data});
        };
    `;

    const create = () => {
        const w = new Worker(new Function(execString));
        return w;
    };

    const destroy = (w) => {
        w.terminate();
    };

    const pool = Pool.createPool({ create, destroy }, { min: 2, max: 8, autostart: false });

    pool.use = (data) => {
        const id = uuid();
        return pool.acquire()
        .then((w) => {
            return new Promise((resolve) => {
                w.postMessage({id, data});
                w.onmessage = (e) => {
                    if (e.data.id === id) resolve(e.data.data);
                    pool.release(w);
                };
            });
        });
    };

    return pool;
};

export default createPool;
