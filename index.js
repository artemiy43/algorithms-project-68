import serve from './src/index.js';

const main = (routes, {path, method = 'GET'}) => {
    const object = {
        routes,
        serve() {
            return serve(this.routes, {path, method});
        }
    };
    
    return object;
};

export default main;
