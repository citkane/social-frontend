/* eslint-disable no-param-reassign */

function checkStatus(data) {
    if (data.status > 199 && data.status < 300) return 'ok';
    return 'bad';
}

class ApiInterface {
    constructor(Vue, store) {
        this.socket = false;
        this.builder = (action, path, args = []) => new Promise((resolve, reject) => {
            if (!this.socket) return reject(new Error('Must be logged in'));
            let thisArgs = args;
            const route = path.split('.');
            if (route.length !== 2) reject(new Error('malformed api call'));
            const type = route[0];
            const command = route[1];
            if (!Array.isArray(thisArgs)) thisArgs = [thisArgs];
            return this.socket.emit(type, action, command, thisArgs, (data) => {
                if (checkStatus(data) === 'ok') {
                    resolve(data.payload || null);
                } else {
                    reject(new Error(`${data.status}: ${data.message}`));
                }
            });
        });
        const api = {
            create: (path, args) => this.builder('create', path, args),
            read: (path, args) => this.builder('read', path, args),
            update: (path, args) => this.builder('update', path, args),
            delete: (path, args) => this.builder('delete', path, args),
            socket: this.socket,
            setSocket: (socket) => { this.socket = socket; api.socket = socket; }
        };
        store.$api = api;
        Vue.prototype.$api = api;
        return api;
    }
}
export default ApiInterface;
