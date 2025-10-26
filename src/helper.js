export default class Trie {
  constructor(key, parent = null, reg = '') {
    this.key = key,
    this.children = {},
    this.parent = parent,
    this.end = false,
    this.handler = null,
    this.method = '',
    this.regExp = reg;
  }

  getWord() {
    const output = [];
    let node = this;

    while (node !== null) {
      output.unshift(node.key);
      node = node.parent;
    }
    return output.join('');
  }

  getHandler({ path, method }) {
    const params = {};
    const words = path ? path.split('/') : [''];
    let node = this;
    words.forEach(word => {
      if (node.children[word]) {
        node = node.children[word];
      }
      else if (node.children && !node.children[word]) {
        Object.keys(node.children).forEach((child) => {
          if (node.children[child]
            && node.children[child].regExp
            && word.match(node.children[child].regExp)) {
            node = node.children[child];
            params[child.replace(':', '')] = word;
          }
        });
      }
    });

    if (node.end && node.method === method) {
      return { params, handler: { body: node.handler.body }};
    }

    return { params, handler: { body: 'Wrong route!' }};
  }

  insert(route) {
    const words = route.path.split('/');
    let node = this;

    words.forEach(word => {
      let key = '';
      let reg = '';
      if (word.startsWith(':') && route.constraints && route.constraints[word.replace(':', '')]) {
        reg = route.constraints[word.replace(':', '')];
      } else if (word.startsWith(':') && (!route.constraints || !route.constraints[word.replace(':', '')])) {
        reg = '^([^/]+)$';
      } else if (!word.startsWith(':')) {
        reg = '';
      }
      key = word;

      if (!node.children[key]) {
        node.children[key] = new Trie(key, node, reg);
      }

      node = node.children[key];

      if (i === words.length - 1) {
        node.end = true;
        node.handler = route.handler;
        node.method = route.method ? route.method : 'GET';
      }
    });
  }
}
