'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});
const Tree = require('./kary-tree.js');

const  reader = module.exports = {};


reader.htmlTree = html => {
  if(!html) return null;
  if(typeof html !== 'string') return null;
  let end = false;
  let tree, tag;
  let stack = [];

  while(!end) {
    html = html.trim();
    if(html.startsWith('</html>')) end = true;
    // console.log(tree);

    if(html[0] === '<' && html[1] === '/') {
      tag = '';
      for(var i = 2; html[i] !== '>'; i ++) {
        tag += html[i];
      }
      html = html.slice(i + 1);
      stack.pop(tag);
      // console.log('remove', stack);

    } else if(html[0] === '<') {
      tag = '';
      for(var j = 1; html[j] !== '>'; j ++) {
        tag += html[j];
      }
      html = html.slice(j + 1);
      tree === undefined ? tree = new Tree(tag)
        : tree.insert('element', tag, stack[stack.length - 1]);
      stack.push(tag);
      // console.log('add', stack);
    } else {
      tag = '';
      for(var k = 0; html[k] !== '<'; k ++) {
        tag += html[k];
      }
      html = html.slice(k);
      tree.insert('text', tag, stack[stack.length - 1]);
      // console.log('add', stack);
    }
  }
  // console.log(tree);
  return tree;

};

reader.readData = (file) => {
  fs.readFileProm(file)
    .then(buff => buff.toString())
    .then(htmldoc =>  {
      htmldoc.split('<!DOCTYPE html>')[1];
      return JSON.stringify(reader.htmlTree(htmldoc));
    })
    .then( data => {
      fs.writeFileProm('./assets/results.json', data);
    })
    .catch(err => new Error(err));
};
