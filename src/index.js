import Trie from './helper.js';

const serve = (routes, {path, method}) => {
    const root = new Trie(null);
    for (let route of routes) {
        root.insert(route);
    }
    console.log('routes:', routes);
    console.log('path and method:', JSON.stringify({path, method}));
    return root.getHandler({path, method});
};

export default serve;