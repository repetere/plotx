import { basename, dirname, extname, resolve } from 'path';
import { promisify } from 'util';
import { outputFile } from 'fs-extra';
import { export, initPool, killPool } from 'highcharts-export-server';

function __async(g){return new Promise(function(s,j){function c(a,x){try{var r=g[x?"throw":"next"](a);}catch(e){j(e);return}r.done?s(r.value):Promise.resolve(r.value).then(c,d);}function d(e){c(e,1);}c();})}

/**
 * returns extension from filepath
 * @param {String} filename - file path 
 * @return {String} file extension
 */
function getFileExtension(filename='') {
  return extname(filename).replace('.','') || 'svg';
}

function getTableData(chart = {}) {
  const points = (chart.xAxis && chart.xAxis.categories)
    ? chart.xAxis.categories
    : (chart.series && chart.series.length)
      ? Object.keys(chart.series[ 0 ])
      : [];  
  const xlabel = (chart.xAxis && chart.xAxis.title && chart.xAxis.title.text)
    ? chart.xAxis.title.text
    : 'xAxis';
  const seriesLabels = (Array.isArray(chart.series))
    ? chart.series.map((chartObj,i) => {
      return (chartObj.name) ? chartObj.name : `plot ${i}`;
    })
    : [];
  
  const chartTable= points.reduce((result, val, index) => { 
    const tableRow = {
      point:points[index],
    };
    seriesLabels.forEach((seriesLabel, si) => {
      tableRow[ seriesLabel ] = chart.series[ si ].data[ index ];
    });
    result.push(tableRow);

    return result;
  }, []);

  return chartTable;
}

/**
 * creates chart image
 * @param {Object} options 
 * @param {Object} [options.filename ='jsk-plot'] - full file path of output image
 * @param {Object} options.chart - options passed to highcharts-export-server CLI 
 * @see { @link https://github.com/highcharts/node-export-server#using-as-a-nodejs-module } 
 * @return {Object} either returns {filename} or {data} if the outfile file is a SVG or PDF will return filename
 */
function plot(options = { }) {return __async(function*(){
  return new Promise((resolve$$1, reject) => {
    try {
      const config = Object.assign({}, { filename: 'jsk-plot', returnTable: true, }, options);
      const filename = (config.filename) ? config.filename : config.outfile;
      const fileext = getFileExtension(filename);
      const formattedFilename = resolve(dirname(filename), `${basename(filename, '.'+fileext)}.${fileext}`);
      //Export settings 
      const exportSettings = {
        type: fileext,
        outfile: formattedFilename,
        options: config.chart,
      };

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
          if (config.returnTable) {
            file.table = getTableData(config.chart);
          }
          if ([ 'svg', 'pdf' ].includes(fileext)) {
            return resolve$$1(file);
          } else {
            outputFile(
              formattedFilename,
              file.data,
             { encoding: 'base64' })
              .then(() => {
                resolve$$1(file);
              })
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

export { getFileExtension, getTableData, plot };
