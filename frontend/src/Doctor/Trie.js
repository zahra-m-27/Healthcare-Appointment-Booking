function TrieNode(key) {
  this.key = key;
  this.parent = null;
  this.children = {};
  this.end = false;
}

TrieNode.prototype.getWord = function () {
  let output = [];
  let node = this;

  while (node !== null) {
    output.unshift(node.key);
    node = node.parent;
  }

  return output.join("");
};

export default function Trie() {
  this.root = new TrieNode("");
}

Trie.prototype.insert = function (word) {
  let node = this.root;

  for (let i = 0; i < word.length; i++) {
    if (!node.children[word[i]]) {
      node.children[word[i]] = new TrieNode(word[i]);
      node.children[word[i]].parent = node;
    }

    node = node.children[word[i]];

    if (i === word.length - 1) {
      node.end = true;
    }
  }
};

Trie.prototype.contains = function (word) {
  let node = this.root;

  for (let i = 0; i < word.length; i++) {
    if (node.children[word[i]]) {
      node = node.children[word[i]];
    } else {
      return false;
    }
  }

  return node.end;
};

Trie.prototype.find = function (prefix) {
  let node = this.root;
  let output = [];

  for (let i = 0; i < prefix.length; i++) {
    if (node.children[prefix[i]]) {
      node = node.children[prefix[i]];
    } else {
      return output;
    }
  }

  findAllWords(node, output);

  return output;
};

function findAllWords(node, arr) {
  if (node.end) {
    arr.unshift(node.getWord());
  }
  for (let child in node.children) {
    findAllWords(node.children[child], arr);
  }
}
