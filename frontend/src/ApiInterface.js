function checkStatus(data) {
    if (data.status > 199 && data.status < 300) return 'ok';
    return 'bad';
}

class ApiInterface {
    constructor(Vue) {
        this.socket = Vue.prototype.$socket;
        this.builder = (action, type, command) => (...args) => new Promise((resolve, reject) => {
            this.socket.emit(type, action, command, args, (data) => {
                if (checkStatus(data) === 'ok') {
                    resolve(data.payload || null);
                } else {
                    reject(new Error(`${data.status}: ${data.message}`));
                }
            });
        });
        return {
            create: api => this[api]('create'),
            read: api => this[api]('read'),
            update: api => this[api]('update'),
            delete: api => this[api]('delete')
        };
    }

    images(action) {
        return {
            test: this.builder(action, 'images', 'test')
        };
    }

    users(action) {
        return {
            all: this.builder(action, 'users', 'all'),
            newUser: this.builder(action, 'users', 'newUser')
        };
    }
}
export default ApiInterface;
