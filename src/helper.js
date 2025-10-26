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
    for (let i = 0; i < words.length; i += 1) {
      if (node.children[words[i]]) {
        node = node.children[words[i]];
      } else if (node.children && !node.children[words[i]]) {
        Object.keys(node.children).forEach((child) => {
          if (node.children[child]
            && node.children[child].regExp
            && words[i].match(node.children[child].regExp)) {
            node = node.children[child];
            params[child.replace(':', '')] = words[i];
          }
        });
      }
    }

    if (node.end && node.method === method) {
      return { params, handler: { body: node.handler.body }};
    }

    return { params, handler: { body: 'Wrong route!' }};
  }

  insert(route) {
    const words = route.path.split('/');
    let node = this;

    for (let i = 0; i < words.length; i += 1) {
      let key = '';
      let reg = '';
      if (words[i].startsWith(':') && route.constraints && route.constraints[words[i].replace(':', '')]) {
        reg = route.constraints[words[i].replace(':', '')];
      } else if (words[i].startsWith(':') && (!route.constraints || !route.constraints[words[i].replace(':', '')])) {
        reg = '^([^/]+)$';
      } else if (!words[i].startsWith(':')) {
        reg = '';
      }
      key = words[i];

      if (!node.children[key]) {
        node.children[key] = new Trie(key, node, reg);
      }

      node = node.children[key];

      if (i === words.length - 1) {
        node.end = true;
        node.handler = route.handler;
        node.method = route.method ? route.method : 'GET';
      }
    }
  }
}
