# jskit-plot
[![Coverage Status](https://coveralls.io/repos/github/repetere/jskit-plot/badge.svg?branch=master)](https://coveralls.io/github/repetere/jskit-plot?branch=master) [![Build Status](https://travis-ci.org/repetere/jskit-plot.svg?branch=master)](https://travis-ci.org/repetere/jskit-plot)

### Description
**JSkit-plot** is a javascript module for quickly plotting data with highcharts. **JSkit-plot** can be used with [ML.js](https://github.com/mljs/ml) and [jskit-learn](https://github.com/repetere/jskit-learn) to suppliment a JavaScript data science toolchain.

### Installation
```sh
$ npm i jskit-plot
```

### [Full Documentation](https://github.com/repetere/jskit-plot/blob/master/docs/api.md)

### Usage (basic)

```javascript
"jskit-plot" : { 
  getFileExtension: [Function: getFileExtension], //returns extension from filepath
  plot: [async Function: plot], //generates svg,png,jpg and pdf image of chart
}
```

### Quick Example

sample data plot

```javascript
import * as jskp from 'jskit-plot';

const chartData = {
  title: {
    text: 'My Chart',
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', ],
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

//In JavaScript, by default most I/O Operations are asynchronous, see the notes section for more
jskp.plot({
  filename:'',
  chart:chartData,
})
  .then(()=>{
    //chart generated
  })
  .catch(console.error);

// or from URL

```

### Testing
```sh
$ npm i
$ grunt test
```
### Contributing
Fork, write tests and create a pull request!


### Development

Note *Make sure you have grunt installed*

```sh
$ npm i -g grunt-cli jsdoc-to-markdown
```

For generating documentation

```sh
$ grunt doc
$ jsdoc2md src/**/*.js  > docs/api.md
```

License
----

MIT