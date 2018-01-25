import { basename, dirname, extname, resolve } from 'path';
import { promisify } from 'util';
import { outputFile } from 'fs-extra';
import { export, initPool, killPool } from 'highcharts-export-server';

function __async(g){return new Promise(function(s,j){function c(a,x){try{var r=g[x?"throw":"next"](a);}catch(e){j(e);return}r.done?s(r.value):Promise.resolve(r.value).then(c,d);}function d(e){c(e,1);}c();})}

function getFileExtension(filename='') {
  return extname(filename).replace('.','') || 'svg';
}

function plot(options = { filename:'jsk-plot'}) {return __async(function*(){
  return new Promise((resolve$$1, reject) => {
    try {
      const config = Object.assign({}, { filename: 'jsk-plot' }, options);
      const filename = (config.filename) ? config.filename : config.outfile;
      const fileext = getFileExtension(filename);
      const formattedFilename = resolve(dirname(filename), `${basename(filename, '.'+fileext)}.${fileext}`);
      //Export settings 
      const exportSettings = {
        type: fileext,
        outfile: formattedFilename,
        options: options.chart,
      };

      // console.log({exportSettings})
      //Set up a pool of PhantomJS workers
      initPool();

      //Perform an export
      /*
        Export settings corresponds to the available CLI arguments described
        above.
      */
      promisify(export)(exportSettings)
        .then(file => {
          // console.log({file})
          killPool();
          if ([ 'svg', 'pdf' ].includes(fileext)) {
            return resolve$$1(file);
          } else {
            outputFile(
              formattedFilename,
              file.data,
             { encoding: 'base64' })
             .then(resolve$$1)
             .catch(reject);
          }
        // fs.outputFileSync('./test.png',res.data, {encoding:'base64'})
        })
        .catch(e => {
          killPool();
          return reject(e);
        });
    } catch (err) {
      return reject(err);
    }
  }); 
}())}

export { getFileExtension, plot };