export default class Trie {
  constructor(key, parent = null, reg = '') {
    this.key = key
    this.children = {}
    this.parent = parent
    this.end = false
    this.handler = null
    this.method = ''
    this.regExp = reg
  }

  getWord() {
    let output = []
    let node = this

    while (node !== null) {
      output.unshift(node.key)
      node = node.parent
    }
    return output.join('')
  }

  getHandler({path, method}) {
    let params = {};
    const words = path ? path.split('/') : [''];
    let node = this
    for (let i = 0; i < words.length; i++) {
      if (node.children[words[i]]) {
        node = node.children[words[i]]
        continue
      }
      else if (node.children) {
        for (let child of Object.keys(node.children)) {
          if (node.children[child] && node.children[child].regExp && words[i].match(node.children[child].regExp)) {
            node = node.children[child];
            params[child.replace(':', '')] = words[i]
          }
        }
      }
    }

    if (node.end && node.method === method) {
      return {'params': params, 'handler': {'body': node.handler.body}}
    }

    return {'params': params, 'handler': {'body': 'Wrong route!'}};
  }

  insert(route) {
    const words = route.path.split('/');
    let node = this

    for (let i = 0; i < words.length; i++) {
      let key = '';
      let reg = '';
      if (words[i].startsWith(':') && route.constraints && route.constraints[words[i].replace(':', '')]) {
        //key = route.constraints[words[i].replace(':', '')];
        reg = route.constraints[words[i].replace(':', '')]
      } else if (words[i].startsWith(':') && (!route.constraints || !route.constraints[words[i].replace(':', '')])) {
        reg = '^([^/]+)$';
      } else if (!words[i].startsWith(':')) {
        reg = '';
      }
      key = words[i];

      if (!node.children[key]) {
        node.children[key] = new Trie(key, node, reg);
      }

      node = node.children[key]

      if (i === words.length - 1) {
        node.end = true
        node.handler = route.handler
        node.method = route.method ? route.method : 'GET'
      }
    }
  }

  remove(route) {
    const word = route.path
    let node = this
    const findWord = (node, word, index) => {
      if (index === word.length) {
        if (!node.end) {
          return false
        }
        node.end = false
        return Object.keys(node.children).length === 0
      }
      if (findWord(node.children[word[index]], word, index + 1)) {
        delete node.children[word[index]]
        return !node.end && Object.keys(node.children).length === 0
      }
      return false
    }
    findWord(node, word, 0)
  }
}

// const toRegExp = (path) => {
//   const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   const pattern = escaped.replace(/:(\w+)/g, '([^/]+)');

//   return new RegExp(`^${pattern}$`);
// };