'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const config = require('./config');
const tpl = require('./template');

app.use(express.static(__dirname+'/'));
// app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use(bodyParser.json(config.json_limit));
app.use(bodyParser.urlencoded({ limit: config.json_limit, extended: false }));

const BAST_PAGES_PATH = '/pages/';

const admin_user = {username: 'admin', password:'hmcy123456'};
var session = [];

var data = [
    {
        "name":"科学馆篇",
        "uuid":"35efe1dc-741a-4e67-a55d-ec9a848d9e1b",
        "sub": [
            {
                "name":"生命科学馆介绍",
                "uuid":"2257b8d4-a2f3-4a51-a1f0-75176bb46f1a",
            },
            {
                "name":"生命之初",
                "uuid":"4abc7321-9a0b-49c1-b9df-51f7279dcc71",
            },
            {
                "name":"生命之美",
                "uuid":"981989d7-2357-42ed-a3d6-a513557f114b",
            },
            {
                "name":"生命之本",
                "uuid":"ea52952c-b729-4c44-b1a3-cb1a375a7099",
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
                "uuid":"62424643-541a-47cf-86a5-b1a76f00aca0",
            },
            {
                "name":"解剖学发展历程",
                "uuid":"cb4b1548-bbb5-403b-9610-497fe7632ed7",
            },
            {
                "name":"解剖学人体九大系统",
                "uuid":"66b17f54-e2dc-4517-a8c1-04ab01c9a6f0",
            }
        ]
    },
    {
        "name":"人体生命篇",
        "uuid":"13d3a4e8-e9c2-4ab5-bf5c-124ca688dc27",
        "sub": [
            {
                "name":"大脑的奥义",
                "uuid":"9e630e24-f1a7-4544-ab4d-ab788814548b",
            },
            {
                "name":"基因工程与人类健康",
                "uuid":"756108bf-33cc-4467-aa08-b4f32ae8544a",
            },
            {
                "name":"DNA双螺旋结构的发现",
                "uuid":"ed51c7ce-a96e-463e-ad63-4bae4f893168",
            }
        ]
    },
    {
        "name":"医学院系篇",
        "uuid":"4a73b2a5-670f-41f8-8f23-cba3c8839167",
        "sub": [
            {
                "name":"学院风采",
                "uuid":"ed51c7ce-a96e-463e-ad63-4bae4f893168",
            },
            {
                "name":"院系介绍",
                "uuid":"8205f62b-a9ad-4f75-8418-f606a0b12e79",
            },
            {
                "name":"名师风采",
                "uuid":"5e913398-f121-460b-92d8-93f422737a12",
            },
            {
                "name":"实验室简介",
                "uuid":"b20cc372-0041-4e10-94a2-26681c697a9e",
            }
        ]
    }
]

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/src/index.html');
});

app.get('/menu', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/list', (req, res) => {
    res.send({status: 'ok', data: data});
});

app.get('/menu/:uuid', function(req, res) {
    if (req.params.uuid && verify_main_uuid(req.params.uuid)){
        res.sendFile(__dirname + '/src/level2.html');
    } else {
        console.log('params error');
        res.sendFile(__dirname + '/src/404.html');
        res.end();
    }
});
app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/src/login.html');
});

app.post('/post_menu', function (req, res) {
    let new_menu = req.body.data;
    // let tempObj = JSON.stringify({
    //     name: new_menu,
    //     uuid: uuidv4(),
    //     sub: []
    // });
    data.push({
        name: new_menu,
        uuid: uuidv4(),
        sub: []
    });
    res.send({status: 'ok', data:data});
});
app.post('/modify_menu', function (req, res) {
    const len = data.length;
    const tempName = req.body.data;
    const id = req.body.uuid;
    for (let i =0;i<len;i++) {
        if (data[i].uuid == id) {
            data[i].name = tempName;
        }
    }
    res.send({status: 'ok', data:data});
});

app.post('/delete_menu', function (req, res) {
    const len = data.length;
    const id = req.body.pid;
    for (let i =0;i<len;i++) {
        if (data[i].uuid == id) {
            data.splice(i,1);
        }
    }
    res.send({status: 'ok', data:data});
});

app.post('/auth/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username == admin_user.username && password == admin_user.password) {
        let sess = {username: username, password: password}
        let token = session_manage(sess);
        console.log('login ok', session);
        res.send({status:'ok', data: {token: token}});
    } else {
        console.log('login faild', session);
        res.send({status:'err', data: 'Error: user not exist.'});
    }
});

app.get('/edit', function(req, res) {
    if(verify_token(req.query.token)){
        res.sendFile(__dirname + '/src/menu_manage.html');
    } else {
        res.sendFile(__dirname + '/src/login.html');
    }

});

app.get('/create_content', function (req, res) {
    if(verify_token(req.query.token)){
        res.sendFile(__dirname + '/src/create.html');
    } else {
        res.sendFile(__dirname + '/src/login.html');
    }
});

app.post('/save_content', function(req, res) {
    const uuid = uuidv4();
    const file_name = 'pages/'+ uuid + '.html';
    const content_html = req.body.data;
    // fs.readFile('config.json', 'utf8', (err, data) => {
    //     if (err) {
    //         res.send({
    //             status: 'error',
    //             data: "Error: config.js can't read or not exist."
    //         });
    //         throw err;
    //     }
        const len = data.length;
        let parent;
        console.log(req.body.pid, data);
        for (let i=0;i<len;i++) {
            if ( data[i].uuid == req.body.pid ) {
                parent = data[i];
                break;
            }
        }
        console.log('parent',parent);
        parent.sub[parent.sub.length] = {
            name: req.body.title,
            uuid: uuid,
        };

    // });
    fs.writeFile(file_name, tpl.tmplate_0+content_html+tpl.tmplate_1, (err) => {
        if (err) throw err;
        console.log('The html file has been saved!');
        res.send({status:'ok'});
    });
});


app.get('/menu/:uuid/content/:cid', function(req, res) {
    // res.send({status:'ok', data:{pid: req.params.uuid, cid:req.params.cid}});
    res.sendFile(__dirname + '/pages/' + req.params.cid + '.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function pages_config_json_add(page_data) {
    fs.readFile('page.config.json', 'utf8', (err, data) => {
        if (err) {
            res.sendFile(__dirname + '/src500.html');
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

function verify_token(token) {
    for (let i = session.length - 1; i >= 0; i--) {
        if(session[i].token == token) {
            return true;
        }
    }
    return false;
}

function verify_main_uuid(uuid) {
    for (let menu of data) {
        if (menu.uuid === uuid) {
            return true;
        }
    }
    return false;
}


function session_manage(se) {
    for (let i = session.length - 1; i >= 0; i--) {
        if(session[i].username == se.username) {
            return session[i].token;
        }
    }
    se.token = uuidv4();
    session.push(se);
    return se.token;
}