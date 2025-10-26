import serve from './src/index.js';

const main = (routes, {path, method = 'GET'}) => {
    const object = {
        routes,
        serve() {
            return serve(this.routes, {path, method});
        }
    };
    console.log('routes:', routes);
    console.log('path and method:', JSON.stringify({path, method}));
    return object;
};

export default main;
