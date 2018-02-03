'use strict';

const reader = require('../lib/html-reader.js');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});
require('jest');

describe('HTML-Reader Module', function() {
  describe('#reader.htmlTree', () => {
    it('should string a file and return a tree', () => {
      fs.readFileProm('../assets/minimal.html')
        .then(buff => buff.toString())
        .then(htmldoc =>  {
          htmldoc.split('<!DOCTYPE html>')[1];
          return JSON.stringify(reader.htmlTree(htmldoc));
        })
        .then(res => {
          expect(res).toBeInstanceOf(Object);
        });
    });
    it('should return null if no string is passed in', () => {
      expect(reader.htmlTree()).toBeNull();
    });
    it('should return null if type of argument is not a string', () => {
      expect(reader.htmlTree(1)).toBeNull();
    });
  });
  describe('#reader.readData', () => {
    it('should be undefined if no file path given', () => {
      expect(reader.readData()).toBe(undefined);
    });
    it('should return undefined if file path is invalid', () => {
      expect(reader.readData('a')).toBe(undefined);
    });
  });
});
