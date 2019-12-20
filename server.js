'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const config = require('./config');

app.use(express.static(__dirname+'/'));
// app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use(bodyParser.json(config.json_limit));
app.use(bodyParser.urlencoded({ limit: config.json_limit, extended: false }));

const BAST_PAGES_PATH = '/pages/';

var data = [
    {
        "name":"科学馆篇",
        "uuid":"35efe1dc-741a-4e67-a55d-ec9a848d9e1b",
        "url":"sicence",
        "sub": [
            {
                "name":"生命科学馆介绍",
                "uuid":"",
                "url":"sicence"
            },
            {
                "name":"生命之初",
                "uuid":"",
                "url":"sicence"
            },
            {
                "name":"生命之美",
                "uuid":"",
                "url":"sicence"
            },
            {
                "name":"生命之本",
                "uuid":"",
                "url":"sicence"
            }
        ]
    },
    {
        "name":"解剖学篇",
        "uuid":"d3ebf8c9-89cf-4d09-bfa7-ef772bfb0e93",
        "url":"anatomy",
        "sub": [
            {
                "name":"解剖学名人名言",
                "uuid":"",
                "url":"anatomy"
            },
            {
                "name":"解剖学发展历程",
                "uuid":"",
                "url":"anatomy"
            },
            {
                "name":"解剖学人体九大系统",
                "uuid":"",
                "url":"anatomy"
            }
        ]
    },
    {
        "name":"人体生命篇",
        "uuid":"13d3a4e8-e9c2-4ab5-bf5c-124ca688dc27",
        "url":"human",
        "sub": [
            {
                "name":"大脑的奥义",
                "uuid":"",
                "url":"human"
            },
            {
                "name":"基因工程与人类健康",
                "uuid":"",
                "url":"human"
            },
            {
                "name":"DNA双螺旋结构的发现",
                "uuid":"",
                "url":"human"
            }
        ]
    },
    {
        "name":"医学院系篇",
        "uuid":"4a73b2a5-670f-41f8-8f23-cba3c8839167",
        "url":"medical",
        "sub": [
            {
                "name":"学院风采",
                "uuid":"",
                "url":"medical"
            },
            {
                "name":"院系介绍",
                "uuid":"",
                "url":"medical"
            },
            {
                "name":"名师风采",
                "uuid":"",
                "url":"medical"
            },
            {
                "name":"实验室简介",
                "uuid":"",
                "url":"medical"
            }
        ]
    }
]

app.get('/', (req, res) => {
   res.sendFile(__dirname + 'index.html');
});

app.get('/list', (req, res) => {
    res.send({status: 'ok', data: data});
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