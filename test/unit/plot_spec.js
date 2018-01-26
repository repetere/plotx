'use strict';
// const path = require('path');
const jskp = require('../../dist/jskit-plot.cjs');
const expect = require('chai').expect;
const fs = require('fs-extra');
const path = require('path');

const chart = {
  title: {
    text: 'My Chart',
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',],
  },
  series: [
    {
      type: 'line',
      data: [1, 3, 2, 4,],
    },
    {
      type: 'line',
      data: [5, 3, 4, 2,],
    },
  ],
};
const testFilePath = './test/mock/plot.svg';
const resolvedTestFilePath = path.resolve(testFilePath);
const testFilePath2 = './test/mock/plot2.svg';
const resolvedTestFilePath2 = path.resolve(testFilePath);
const testFilePNGPath = './test/mock/plot.png';
const resolvedTestFilePNGPath = path.resolve(testFilePNGPath);
describe('jskit-plot', function () { 
  this.timeout(2000);
  describe('getFileExtension', () => {
    it('should by default return svg', () => {
      expect(jskp.getFileExtension()).to.eql('svg');
    });
    it('should the file extension', () => {
      expect(jskp.getFileExtension('myfile.pdf')).to.eql('pdf');
      expect(jskp.getFileExtension('myfile.png')).to.eql('png');
      expect(jskp.getFileExtension('myfile.svg')).to.eql('svg');
      expect(jskp.getFileExtension('myfile.jpg')).to.eql('jpg');
    });
  });
  describe('plot', function () {
    before(function (done) {
      fs.remove(resolvedTestFilePath, done);
    });
    it('should work asynchronously', function(done){
      jskp.plot({
        filename: testFilePath,
        chart,
      })
        .then(val => {
          expect(val).to.haveOwnProperty('filename');
          expect(jskp.getFileExtension(val.filename)).to.eql('svg');
          expect(fs.pathExistsSync(resolvedTestFilePath)).to.be.true;
          done();
        })
        .catch(done);
    });
    it('should work with outfile', function(done){
      jskp.plot({
        outfile: testFilePath2,
        chart,
      })
        .then(val => {
          // console.log({ val,resolvedTestFilePath});
          expect(val).to.haveOwnProperty('filename');
          expect(jskp.getFileExtension(val.filename)).to.eql('svg');
          expect(fs.pathExistsSync(resolvedTestFilePath2)).to.be.true;
          done();
        })
        .catch(done);
    });
    it('should output a default svg', function (done) {
      jskp.plot({
        chart,
      })
        .then(defaultVal => {
          // console.log({defaultVal})
          expect(jskp.getFileExtension(defaultVal.filename)).to.eql('svg');
          done();
        })
        .catch(done);
    });
    it('should error with no chart', function (done) {
      jskp.plot({
      })
        .then(() => {
          done(new Error('should have thrown error without data'));
        })
        .catch(e => {
          expect(e).to.eql('no input given');
          done();
        });
    });
    it('should export png file', function (done) {
      jskp.plot({
        filename: testFilePNGPath,
        chart,
      })
        .then(pngVal => {
          expect(pngVal).to.be.an('object');
          expect(fs.pathExistsSync(resolvedTestFilePNGPath)).to.be.true;
          done();
        })
        .catch(done);
    });
    after(function (done) {
      Promise.all([
        fs.remove(path.resolve('./jsk-plot.svg')),
        fs.remove(resolvedTestFilePath),
        fs.remove(resolvedTestFilePath2),
        fs.remove(resolvedTestFilePNGPath),
      ])
        .then(results => {
          // console.log({ results });
          done();
        })
        .catch(done);
    });
  });
});