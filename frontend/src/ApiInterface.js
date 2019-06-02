class ApiInterface {
    constructor(Vue) {
        this.socket = Vue.prototype.$socket;
        return {
            image: this.image()
        };
    }

    image() {
        return {
            download: location => new Promise((resolve, reject) => {
                console.log('hello image');
                this.socket.emit('image.download', location, (confirmation) => {
                    console.log(confirmation);
                });
            })
        };
    }
}
export default ApiInterface;
