/*
 * @Author: zhaoxiaoyang
 * @Date:   2017-10-24 17:32:50
 * @Last Modified by:   zhaoxiaoyang
 * @Last Modified time: 2017-10-31 19:00:45
 */

'use strict';

import mkdirp from 'mkdirp'
import fs from 'fs'

function generateMock(_dir, _data) {

	let fileName = _dir.split('/')[_dir.split('/').length - 1],
		_dirModel = 'app/src/new/model/',
		_path = _dir.replace(fileName, '')

	mkdirp(_dirModel + _path, function(err) {
		if (err) {
			console.error('mkdirp err: ', err)
		} else {
			console.info('file ' + _path + ' created!')

			console.log(_dir, _data)

			fs.writeFile(_dirModel + _dir, _data, {
				encoding: "utf8"
			}, function(err) {
				console.error('writeFile err:', err);
			});

			fs.readFile(_dirModel + 'index.html', {
				encoding: "utf8"
			}, function(err, data) {
				console.error('readFile err:', err)
				console.log(_data)
			});
		}
	});

};

export default generateMock;