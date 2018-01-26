import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs-extra';
import * as highcharts from 'highcharts-export-server';

/**
 * returns extension from filepath
 * @param {String} filename - file path 
 * @return {String} file extension
 */
export function getFileExtension(filename='') {
  return path.extname(filename).replace('.','') || 'svg';
}

/**
 * returns an array of objects (a table of the chart data)
 * @param {*} chart 
 */
export function getTableData(chart = {}) {
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
export async function plot(options = { }) {
  return new Promise((resolve, reject) => {
    try {
      const config = Object.assign({}, { filename: 'jsk-plot', returnTable: true, }, options);
      const filename = (config.filename) ? config.filename : config.outfile;
      const fileext = getFileExtension(filename);
      const formattedFilename = path.resolve(path.dirname(filename), `${path.basename(filename, '.'+fileext)}.${fileext}`);
      //Export settings 
      const exportSettings = {
        type: fileext,
        outfile: formattedFilename,
        options: config.chart,
      };

      //Set up a pool of PhantomJS workers
      highcharts.initPool();

      //Perform an export
      /*
        Export settings corresponds to the available CLI arguments described
        above.
      */
      util.promisify(highcharts.export)(exportSettings)
        .then(file => {
          // console.log({file})
          highcharts.killPool();
          if (config.returnTable) {
            file.table = getTableData(config.chart);
          }
          if ([ 'svg', 'pdf' ].includes(fileext)) {
            return resolve(file);
          } else {
            fs.outputFile(
              formattedFilename,
              file.data,
             { encoding: 'base64' })
              .then(() => {
                resolve(file);
              })
             .catch(reject);
          }
        // fs.outputFileSync('./test.png',res.data, {encoding:'base64'})
        })
        .catch(e => {
          highcharts.killPool();
          return reject(e);
        });;
    } catch (err) {
      return reject(err);
    }
  }); 
}