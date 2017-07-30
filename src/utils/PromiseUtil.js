export const promisify = (func, ...args) => {
    return new Promise((resolve, reject) => {
        func(...args, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};
