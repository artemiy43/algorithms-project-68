import Trie from './helper.js';

const serve = (routes, {path, method}) => {
    const root = new Trie(null);
    for (let route of routes) {
        root.insert(route);
    }
    return root.getHandler({path, method});
};

export default serve;