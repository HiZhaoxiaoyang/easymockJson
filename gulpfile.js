/*
 * @Author: zhaoxiaoyang
 * @Date:   2017-11-13 11:43:21
 * @Last Modified by:   zhaoxiaoyang
 * @Last Modified time: 2017-11-13 11:55:55
 */

'use strict';


import gulp from 'gulp'
import browser from 'browser-sync'
import _ from 'lodash'
import gutil from 'gulp-util'
import webpack from 'webpack'
import Config from './bin/webpack.dev.config.js'
// import ProductConfig from './bin/webpack.product.config.js'
import routers from './app/src/new/model/route.js'
import Proxys from 'gulp-connect-proxy'
import connects from 'gulp-connect'

// mock
import fs from 'fs'
import mkdirp from 'mkdirp'
import express from 'express'
import bodyParser from 'body-parser'
import mocker from './mocker.js'

let browserSync = browser.create(),
	CurrentModule = Config.CurrentModule,
	CurrentPort = Config.CurrentPort,
	webpackDevconfig = Config.config,
	app = express();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded


app.post('/', function(req, res, next) {

	let obj = req.body
		// console.log(obj.route) generateMock
	mocker(obj.route, obj.cont)

	res.send('post end')

}).put('/', function(req, res, next) {

	res.send('PUT request to the homepage');
});

app.use(express.static('app/src/new/model'))

app.listen(9801, function() {
	console.log('Example app listening on port 9801!');
});

/*
let cors = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
};
gulp.task("datamodel", function() {
    connects.server({
        root: "app/src/new/model",
        port: 9001,
        livereload: true,
        fallback: function(argument) {
            // console.log('argument:', argument)
            return 'app/src/new/model/data.html'
        },
        middleware: function(connect, opt) {
            opt.route = '/datamodel';
            // console.log('connect', connect)
                // console.log('opt', opt)
                // opt.app.use(cors)
            return [cors]
                // return [new Proxys(opt)];
        }
    });
});
*/

gulp.task("mocker", function(e) {
	let _path = './api'
	mkdirp('./test/newapi/api', function(err) {
		console.log(err)
		if (err) console.error(err)
		else console.log(`file ${_path} created!`)
	});
})



/**
 * [同源代理策略]
 * @param  {String}   [gulp task]
 * @param  {Function} [callback]
 */
gulp.task("proxies", function() {
	connects.server({
		root: "app",
		port: 8889,
		livereload: true,
		// https: true,
		middleware: function(connect, opt) {
			opt.route = '/proxies';
			var pro = new Proxys(opt);
			return [pro];
		}
	});
});


// "dev": "webpack --watch --colors --config bin/webpack.dev.config.js",


console.time('serverTime')

gulp.task('server', ['build'], () => {
	// var files = ['./app/www/']
	browserSync.init( /*files, */ {
		open: 'external',
		ui: false,
		notify: false,
		serveStatic: ['./app/www/', 'app/src/new/model'],
		host: "local.test123.com",
		port: CurrentPort || 3333,
		proxy: {
			proxyReq: [
				function(proxyReq) {
					// proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
					proxyReq.setHeader("Access-Control-Allow-Origin", "*")
					proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
					proxyReq.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
				}
			],
			reqHeaders: function(config) {
				return {
					"host": "local.test123.com",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
					"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
				}
			},
			// target: `${routers.ssl}${routers.origin[inter]}.test123.com`,
			target: 'http://local.test123.com:8889',
			middleware: function(req, res, next) {
				if (/proxies/igm.test(req.url)) {
					// target: `${routers.ssl}${restRouters}.test123.com`,
					let restApiUrl = req.url.replace(/\/proxies\/|\/\//img, '')
						// console.log('req.url:', req.url)
						// console.log('restApiUrl:', restApiUrl)
					console.log('Restful API:', `${routers.ssl}${restApiUrl}`)
				}
				next();
			}
		}
		// ,https: true
		// ,httpModule: "http2"
	});

	console.time('watch')
	gulp.watch('./app/www/*.*', (file) => {
		console.log(file.path);
		// console.timeEnd && console.timeEnd('watch')
		browserSync.reload();
	})
	console.timeEnd('serverTime')
});

console.time('build')
gulp.task('build', () => {
	// console.timeEnd('build')
	console.log('\nServer loading ...\n')
	return gulp.src([
			'app/images/**/*.*'
		], {
			base: 'app/'
		})
		.pipe(gulp.dest('app/www/'));
});

gulp.task('webpack', (callback) => {
	console.time('webpack.dev')
	webpack(webpackDevconfig, (err, stats) => {
		console.timeEnd('webpack.dev')
		if (err) {
			throw new gutil.PluginError('webpack', err)
		}
	})
})

// clear webkpack
gulp.task('clean:webpack', (callback) => {
	webpack(webpackDevconfig, (err, stats) => {
		// console.log(err, stats);
		callback && callback()
	});
});

// reset webkpack
gulp.task('webpack', ['clean:webpack'], () => {
	webpack(webpackDevconfig, (err, stats) => {});
});


gulp.task('dev', ['proxies', /*'datamodel','watch:webpack'*/ ], (callback) => {
	callback && callback()
});

gulp.task('webpackpro', (callback) => {
	webpack(productConfig, (err, stats) => {
		if (err) {
			throw new gutil.PluginError('webpack', err);
		}
		gutil.log('[webpack]', stats.toString());
		callback && callback();
	});
});

gulp.start('dev', (err) => {
	if (err) {
		console.log('\n#### Dev error: ', err, '\n')
	} else {
		console.log('\n#### Dev start: \n')
	}
});