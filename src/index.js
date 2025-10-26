import Trie from './helper.js';

const serve = (routes, { path, method = 'GET'} ) => { 
  const root = new Trie(null);
  routes.forEach((route) => {
    root.insert(route);
  });

  return root.getHandler({ path, method });
};

export default serve;
