'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const config = require('./config');

app.use(express.static(__dirname+'/'));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use(bodyParser.json(config.json_limit));
app.use(bodyParser.urlencoded({ limit: config.json_limit, extended: false }));

const BAST_PAGES_PATH = '/pages/';

app.get('/', (req, res) => {
   res.sendFile(__dirname + 'index.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function pages_config_json_add(page_data) {
    fs.readFile('page.config.json', 'utf8', (err, data) => {
        if (err) {
            res.sendFile(__dirname + '500.html');
            console.log('page config error!');
        }
        var new_data = JSON.parse(data);
        new_data[new_data.length] = {
            name: page_data.title,
            uuid: uuidv4(),
        };
        fs.writeFile('config.json', JSON.stringify(new_data), (err) => {
            if (err) throw err;
            console.log('The config file had been saved!');
        });
    });
}