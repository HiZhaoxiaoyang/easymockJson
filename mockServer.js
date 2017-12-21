/*
 * @Author: zhaoxiaoyang
 * @Date:   2017-12-21 17:33:04
 * @Last Modified by:   zhaoxiaoyang
 * @Last Modified time: 2017-12-21 18:19:35
 */

'use strict';

/*
require('babel-register')({ignore: false})
require('babel-polyfill')
*/

import express from 'express'
import bodyParser from 'body-parser'
import mocker from './mocker.js'

let app = express();


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/', function(req, res, next) {

    let obj = req.body

    mocker(obj.route, obj.cont)

    res.send('post end')

}).put('/', function(req, res, next) {

    res.send('PUT request to the homepage');

});

app.use(express.static('mock'))

app.listen(9801, function() {

    console.log('mock app listening on port 9801!');

});

