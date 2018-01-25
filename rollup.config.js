import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import async from 'rollup-plugin-async';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'jskit-plot',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			// async(),

      babel({
        exclude: 'node_modules/**', // only transpile our source code
				runtimeHelpers: true,
			}),
			resolve({
        preferBuiltins: true,
      }), // so Rollup can find `ms`
      builtins({
      }),
      // commonjs({
      //   namedExports: {
      //     // left-hand side can be an absolute path, a path
      //     // relative to the current directory, or the name
      //     // of a module in node_modules
      //     // 'node_modules/ml-array-utils/src/index.js': [ 'scale' ]
      //   }
			// }), // so Rollup can convert `ms` to an ES module
			globals({
      }),
		]
	},
	{
		input: 'src/main.js',
		external: [
			'path',
			'util',
			'fs-extra',
			'highcharts-export-server',
		], // <-- suppresses the warning
		output: [
			{
				name: 'jskit-plot',
				// exports: 'named',
				file: pkg.main,
				format: 'cjs',
			},
			{
				name: 'jskit-plot',
				// exports: 'named',
				file: pkg.module,
				format: 'es',
			},
		],
		plugins: [
			async(),
			// babel({
			//   exclude: 'node_modules/**', // only transpile our source code
			// }),
		],
	},
];
