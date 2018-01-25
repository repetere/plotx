## Functions

<dl>
<dt><a href="#getFileExtension">getFileExtension(filename)</a> ⇒ <code>String</code></dt>
<dd><p>returns extension from filepath</p>
</dd>
<dt><a href="#plot">plot(options)</a> ⇒ <code>Object</code></dt>
<dd><p>creates chart image</p>
</dd>
</dl>

<a name="getFileExtension"></a>

## getFileExtension(filename) ⇒ <code>String</code>
returns extension from filepath

**Kind**: global function  
**Returns**: <code>String</code> - file extension  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>String</code> | file path |

<a name="plot"></a>

## plot(options) ⇒ <code>Object</code>
creates chart image

**Kind**: global function  
**Returns**: <code>Object</code> - either returns {filename} or {data} if the outfile file is a SVG or PDF will return filename  
**See**: [https://github.com/highcharts/node-export-server#using-as-a-nodejs-module](https://github.com/highcharts/node-export-server#using-as-a-nodejs-module)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| [options.filename] | <code>Object</code> | <code>&#x27;jsk-plot&#x27;</code> | full file path of output image |
| options.chart | <code>Object</code> |  | options passed to highcharts-export-server CLI |

