import Trie from './helper.js';

const serve = (routes, path, method) => {
    const root = new Trie(null);
    for (let route of routes) {
        // console.log(route);
        root.insert(route);
        // console.log(root);
    }
    //return {body: 'Wrong route!'};
    return root.getHandler(path, method);
};

export default serve;