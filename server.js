'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
var FroalaEditor = require('./lib/froalaEditor');
const uuidv4 = require('uuid/v4');
const config = require('./config');

const tpl = require('./template');

app.use(express.static(__dirname+'/'));
// app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use(bodyParser.json(config.json_limit));
app.use(bodyParser.urlencoded({ limit: config.json_limit, extended: false }));

const admin_user = {username: 'admin', password:'hmcy123456'};
var session = [];

var data_config;
read_config();
function read_config(callback = null) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        console.log('Read config file success!');
        data_config = JSON.parse(data);
        if (callback) {
            callback();
        }
    });
}

function write_config(callback) {
    fs.writeFile('data.json', JSON.stringify(data_config), (err) => {
        if (err) {
            throw err;
        };
        console.log('The config file has been saved!');
        read_config(callback);
    });
}


// app.get('/test', (req, res) => {
//     res.sendFile(__dirname + '/test.html');
// });

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'v3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/src/index.html');
});

app.get('/menu', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/list', (req, res) => {
    res.send({status: 'ok', data: data_config});
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
    data_config.push({
        name: new_menu,
        uuid: uuidv4(),
        sub: []
    });
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

app.post('/post_menu/:oid/leve2', function (req, res) {
    const oid = req.params.oid; 
    let new_menu = req.body.data;
    for (var i = data_config.length - 1; i >= 0; i--) {
        let temp =  data_config[i];
        if (temp.uuid == oid) {
            temp.sub.push({
                name: new_menu,
                uuid: uuidv4(),
                sub: []
            });
            break;
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

app.post('/post_menu/:rid/leve2/:pid/level3', function (req, res) {
    const rid = req.params.rid; 
    const pid = req.params.pid;
    let new_menu = req.body.data;
    loop: for (let i = data_config.length - 1; i >= 0; i--) {
        if (data_config[i].uuid == rid) {
            let temp = data_config[i].sub;
            for (let j = temp.length - 1; j >= 0; j--) {
                if(temp[j].uuid == pid) {
                    temp[j].sub.push({
                        name: new_menu,
                        uuid: uuidv4(),
                        sub: []
                    });
                    break loop;
                }
            }
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

app.post('/modify_menu', function (req, res) {
    const len = data_config.length;
    const tempName = req.body.data;
    const id = req.body.uuid;
    for (let i =0;i<len;i++) {
        if (data_config[i].uuid == id) {
            data_config[i].name = tempName;
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

app.post('/modify_menu/:oid/level2', function (req, res) {
    const len = data_config.length;
    const tempName = req.body.data;
    const oid = req.params.oid;
    const id = req.body.uuid;
    loop: for (let i =0;i<len;i++) {
        if (data_config[i].uuid == oid) {
            let temp = data_config[i].sub;
            for (let j = temp.length - 1; j >= 0; j--) {
                if(temp[j].uuid == id){
                    temp[j].name = tempName;
                    break loop;
                }
            }
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

app.post('/modify_menu/:oid/level2/:pid/level3', function (req, res) {
    const len = data_config.length;
    const tempName = req.body.data;
    const oid = req.params.oid;
    const pid = req.params.pid;
    const id = req.body.uuid;
    loop: for (let i =0;i<len;i++) {
        if (data_config[i].uuid == oid) {
            let temp = data_config[i].sub;
            for (let j = temp.length - 1; j >= 0; j--) {
                if(temp[j].uuid == pid){
                   let temp1 = temp[j].sub;
                   for (let n = temp1.length - 1; n >= 0; n--) {
                       if(temp1[n].uuid == id) {
                           temp1[n].name = tempName;
                           break loop;
                       }
                   }
                }
            }
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

function delete_file(file) {
    let file_name = 'pages/'+ file + '.html';
    fs.stat(file_name, function(err, stats){
        if(err){
            console.log('delete_file stats: ', err);
            // throw err;
            // res.send({status:'error', data: 'file not exist'});
            if (file.sub && file.sub.length) {
                for(let f of file.sub) {
                    delete_file(f);
                }
            }
        }else{
            fs.unlink(file_name, (err) => {
                if (err) throw err;
                console.log(file_name + ' was deleted');
            });
        }
    });
}

app.post('/delete_menu', function (req, res) {
    const len = data_config.length;
    const id = req.body.uuid;
    for (let i =0;i<len;i++) {
        if (data_config[i].uuid == id) {
            let del_list = data_config.splice(i,1)[0].sub;
            for (let file of del_list) {
                delete_file(file);
            }
            break;
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

app.post('/delete_menu/:rid/level/:pid', function (req, res) {
    const len = data_config.length;
    const rid = req.params.rid;
    const pid = req.params.pid;
    
    loop: for (let i =0;i<len;i++) {
        if (data_config[i].uuid == rid) {
            let temp = data_config[i].sub;
            for (let j = temp.length - 1; j >= 0; j--) {
                if(temp[j].uuid == pid) {
                    let del_list = temp.splice(j,1)[0].sub;
                    for (let file of del_list) {
                        delete_file(file);
                    }
                    break loop;
                }
            }
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

app.post('/delete_menu/:rid/level/:pid/level2/:sid', function (req, res) {
    const rid = req.params.rid;
    const pid = req.params.pid;
    const sid = req.params.sid;

    const len = data_config.length;
    loop: for (let i =0;i<len;i++) {
        if (data_config[i].uuid == rid) {
            let temp = data_config[i].sub;
            for (let j = temp.length - 1; j >= 0; j--) {
                if(temp[j].uuid == pid) {
                    let temps = temp[j].sub;
                    for (let n = temps.length - 1; n >= 0; n--) {
                        if(temps[n].uuid == sid) {
                            let del_list = temps.splice(n,1)[0].sub;
                            for (let file of del_list) {
                                delete_file(file);
                            }
                            break loop;
                        }
                    } 
                }
            }
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
});

app.post('/delete_menu/:rid/level/:pid/level2/:sid/level3/:cid', function (req, res) {
    const rid = req.params.rid;
    const pid = req.params.pid;
    const sid = req.params.sid;
    const cid = req.params.cid;

    const len = data_config.length;
    loop: for (let i =0;i<len;i++) {
        if (data_config[i].uuid == rid) {
            let temp = data_config[i].sub;
            for (let j = temp.length - 1; j >= 0; j--) {
                if(temp[j].uuid == pid) {
                    let temps = temp[j].sub;
                    for (let n = temps.length - 1; n >= 0; n--) {
                        if(temps[n].uuid == sid) {
                            let temp1 = temps[n].sub;
                            for (let m = temp1.length - 1; m >= 0; m--) {
                                if(temp1[m].uuid == cid) {
                                    temp1.splice(m,1);
                                    delete_file(cid);
                                    break loop;
                                }
                            }
                        }
                    } 
                }
            }
        }
    }
    write_config(()=>{
        res.send({status: 'ok', data:data_config});
    });
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
    if (req.query.token) {
        if (!verify_token(req.query.token)) {
            res.sendFile(__dirname + '/src/login.html');
        } else {
            res.sendFile(__dirname + '/src/menu_manage.html');
        }
    } else {
        res.sendFile(__dirname + '/src/login.html');
    }
});

app.get('/create_content', function (req, res) {
    if (!req.query.token) {
        res.sendFile(__dirname + '/src/login.html');
    }
    if(verify_token(req.query.token)){
        res.sendFile(__dirname + '/src/create.html');
    } else {
        res.sendFile(__dirname + '/src/login.html');
    }
});

app.post('/save_content', function(req, res) {
    const uuid = uuidv4();
    const file_name = 'pages/' + uuid + '.html';
    const content_html = req.body.data;

    const rid = req.query.rid;
    const pid = req.query.pid;
    const sid = req.query.sid;
    if (sid) {
        loop: for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i].sub;
                for (let j = root.length - 1; j >= 0; j--) {
                    if(root[j].uuid == pid) {
                        let parent = root[j].sub;
                        for (let n = parent.length - 1; n >= 0; n--) {
                            if(parent[n].uuid == sid) {
                                let son = parent[n];
                                son.sub[son.sub.length] = {
                                    name: req.body.title,
                                    uuid: uuid,
                                };
                                break loop;
                            }
                        } 
                    }
                }
            }
        }
    } else if (pid) {
        loop: for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i].sub;
                for (let j = root.length - 1; j >= 0; j--) {
                    if(root[j].uuid == pid) {
                        let parent = root[j];
                        parent.sub[parent.sub.length] = {
                            name: req.body.title,
                            uuid: uuid,
                        };
                        break loop;
                    }
                }
            }
        }
    } else if (rid) {
        for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i];
                root.sub[root.sub.length] = {
                    name: req.body.title,
                    uuid: uuid,
                };
                break;
            }
        }
    } else {
        res.send({status: 'err', data:"params error."});
    }
    fs.writeFile(file_name, tpl.tmplate_0 + content_html + tpl.tmplate_1, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        write_config(()=>{
            res.send({status: 'ok'});
        });
    });
});
app.get('/menu/:uuid/content/:cid', function(req, res) {
    // res.send({status:'ok', data:{pid: req.params.uuid, cid:req.params.cid}});
    res.sendFile(__dirname + '/pages/' + req.params.cid + '.html');
});
/**----------------------------------------------------------*/
app.get('/menu/:oid/level2/:tid', function(req, res) {
    res.sendFile(__dirname + '/src/level3.html');
});

app.get('/menu/:oid/level2/:tid/c/:cid', function(req, res) {
     res.sendFile(__dirname + '/pages/' + req.params.cid + '.html');
});

app.get('/menu/:oid/level2/:tid/level3/:sid/c/:cid', function(req, res) {
    res.sendFile(__dirname + '/pages/' + req.params.cid + '.html');
});

app.get('/json/:oid/level2/:tid', function(req, res) {
    const oid = req.params.oid;
    const cid = req.params.tid;
    const len = data_config.length;
    let res_data = [];
    loop: for (let i = 0; i < len; i++) {
        if (data_config[i].uuid == oid) {
            let parent = data_config[i];
            for (let sub of parent.sub) {
                if (sub.uuid == cid) {
                    if (sub.sub && sub.sub.length) {
                        res_data = sub.sub;
                        break loop;
                    }
                }
            }
        }
    }
    res.send({status:"ok", data:res_data});
});

// app.get('/menu/:uuid/content/:cid', function(req, res) {
//     // res.send({status:'ok', data:{pid: req.params.uuid, cid:req.params.cid}});
//     res.sendFile(__dirname + '/pages/' + req.params.cid + '.html');
// });

app.get('/menu/:oid/level2/:tid/level3/:sid', function(req, res) {
    res.sendFile(__dirname + '/src/level4.html');
});

app.get('/json/:oid/level2/:tid/level3/:sid', function(req, res) {
    const oid = req.params.oid;
    const cid = req.params.tid;
    const sid = req.params.sid;
    const len = data_config.length;
    let res_data = [];
    loop: for (let i = 0; i < len; i++) {
        if (data_config[i].uuid == oid) {
            let parent = data_config[i];
            for (let sub of parent.sub) {
                if (sub.uuid == cid) {
                   for (let ssc of sub.sub) {
                       if (sid == ssc.uuid) {
                           res_data = ssc.sub;
                           break loop;
                       }
                   }
                }
            }
        }
    }
    res.send({status:"ok", data:res_data});
});

/**----------------------------------------------------------*/
app.post('/delete/:pid/:cid', function (req, res) {
    const pid = req.params.pid;
    const cid = req.params.cid;

    let len = data_config.length;
    loop:for (let i=0;i<len;i++) {
        let temp = data_config[i];
        if (temp.uuid == pid) {
            for (let j=temp.sub.length-1;j>-1;j--) {
                if (temp.sub[j].uuid == cid) {
                    temp.sub.splice(j,1);
                    break loop;
                }
            }
        }
    }
    write_config(()=>{
    });
    const file_name = 'pages/' + cid + '.html';
    fs.stat(file_name, function(err, stats){
        if(err){
            res.send({status:'ok', data: data_config});
            // throw err;
        }else{
            fs.unlink(file_name, (err) => {
                if (err) throw err;
                console.log(file_name + ' was deleted');
                res.send({status:'ok', data: data_config});
            });
        }
    })
});
app.get('/modify', function (req, res) {
    if (!req.query.token) {
        res.sendFile(__dirname + '/src/login.html');
    }
    if(verify_token(req.query.token)){
        res.sendFile(__dirname + '/src/edit.html');
    } else {
        res.sendFile(__dirname + '/src/login.html');
    }
});
app.post('/modify', function (req, res) {
    if (!req.query.token) {
        res.sendFile(__dirname + '/src/login.html');
    }

    const rid = req.query.rid;
    const pid = req.query.pid;
    const sid = req.query.sid;
    const cid = req.query.cid;

    let file_name, name;
    if (cid) {
        file_name = 'pages/'+ cid + '.html';
        loop: for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i].sub;
                for (let j = root.length - 1; j >= 0; j--) {
                    if(root[j].uuid == pid) {
                        let parent = root[j].sub;
                        for (let n = parent.length - 1; n >= 0; n--) {
                            if(parent[n].uuid == sid) {
                                let son = parent[n].sub;
                                for (let m = son.length - 1; m >= 0; m--) {
                                    if(son[m].uuid == cid) {
                                        name = son[m].name;
                                        break loop;
                                    }
                                }
                            }
                        } 
                    }
                }
            }
        }

    } else if (sid) {
        file_name = 'pages/'+ sid + '.html';
        loop: for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i].sub;
                for (let j = root.length - 1; j >= 0; j--) {
                    if(root[j].uuid == pid) {
                        let parent = root[j].sub;
                        for (let n = parent.length - 1; n >= 0; n--) {
                            if(parent[n].uuid == sid) {
                                name = parent[n].name;
                                break loop;
                            }
                        } 
                    }
                }
            }
        }
    } else if (pid) {
        file_name = 'pages/'+ pid + '.html';
        loop: for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i].sub;
                for (let j = root.length - 1; j >= 0; j--) {
                    if(root[j].uuid == pid) {
                        name = root[j].name;
                        break loop;
                    }
                }
            }
        }
    } else {
        res.send({status: 'err', data:"params error."});
    }
    fs.readFile(file_name, 'utf8', (err, content) => {
        if (err) {
            res.send({
                status: 'error',
                data: "Error: file can't read or not exist."
            });
            // throw err;
            return;
        }
        const HEADER = tpl.tmplate_0.length;
        const FOOTER = tpl.tmplate_1.length;
        const ctx_len = content.length - HEADER - FOOTER;
        const ctx = content.substr(HEADER, ctx_len);
        res.send({status:'ok', data: ctx, name:name});
    });
});

app.post('/save_content/modify', function(req, res) {
    const rid = req.query.rid;
    const pid = req.query.pid;
    const sid = req.query.sid;
    const cid = req.query.cid;
    if (rid == null || pid == null) {
        res.send({status:'err', data:"params error."});
        return;
    }
    let file_name;
    if(cid){
        file_name = 'pages/'+ cid + '.html';
        loop: for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i].sub;
                for (let j = root.length - 1; j >= 0; j--) {
                    if(root[j].uuid == pid) {
                        let parent = root[j].sub;
                        for (let n = parent.length - 1; n >= 0; n--) {
                            if(parent[n].uuid == sid) {
                                let son = parent[n].sub;
                                for (let m = son.length - 1; m >= 0; m--) {
                                    if(son[m].uuid == cid) {
                                        son[m].name = req.body.title;
                                        break loop;
                                    }
                                }
                            }
                        } 
                    }
                }
            }
        }
    }else if (sid) {
        file_name = 'pages/'+ sid + '.html';
        loop: for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i].sub;
                for (let j = root.length - 1; j >= 0; j--) {
                    if(root[j].uuid == pid) {
                        let parent = root[j].sub;
                        for (let n = parent.length - 1; n >= 0; n--) {
                            if(parent[n].uuid == sid) {
                                parent[n].name = req.body.title;
                                break loop;
                            }
                        } 
                    }
                }
            }
        }
    } else if (pid) {
        file_name = 'pages/'+ pid + '.html';
        loop: for (let i = data_config.length - 1; i >= 0; i--) {
            if(data_config[i].uuid == rid) {
                let root = data_config[i].sub;
                for (let j = root.length - 1; j >= 0; j--) {
                    if(root[j].uuid == pid) {
                        root[j].name = req.body.title; 
                        break loop;
                    }
                }
            }
        }
    } else {
        res.send({status: 'err', data:"params error."});
    }
    const content_html = req.body.data;
    fs.writeFile(file_name, tpl.tmplate_0 + content_html + tpl.tmplate_1, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        write_config(()=>{
            res.send({status: 'ok'});
        });
    });

});

app.post('/upload_image', function (req, res) {

    FroalaEditor.Image.upload(req, '/uploads/', function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

app.post('/upload_video', function (req, res) {

    FroalaEditor.Video.upload(req, '/uploads/', function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

app.post('/upload_image_resize', function (req, res) {

    var options = {
        resize: [300, 300]
    }
    FroalaEditor.Image.upload(req, '/uploads/', options, function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

app.post('/upload_image_validation', function (req, res) {

    var options = {
        fieldname: 'myImage',
        validation: function(filePath, mimetype, callback) {

            gm(filePath).size(function(err, value){

                if (err) {
                    return callback(err);
                }

                if (!value) {
                    return callback('Error occurred.');
                }

                if (value.width != value.height) {
                    return callback(null, false);
                }
                return callback(null, true);
            });
        }
    }

    FroalaEditor.Image.upload(req, '/uploads/', options, function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

app.post('/upload_file', function (req, res) {

    var options = {
        validation: null
    }

    FroalaEditor.File.upload(req, '/uploads/', options, function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        res.send(data);
    });
});

app.post('/upload_file_validation', function (req, res) {

    var options = {
        fieldname: 'myFile',
        validation: function(filePath, mimetype, callback) {

            fs.stat(filePath, function(err, stat) {

                if(err) {
                    return callback(err);
                }

                if (stat.size > 10 * 1024 * 1024) { // > 10M
                    return callback(null, false);
                }

                return callback(null, true);

            });
        }
    }

    FroalaEditor.File.upload(req, '/uploads/', options, function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        res.send(data);
    });
});

app.post('/delete_image', function (req, res) {

    FroalaEditor.Image.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});
app.post('/delete_video', function (req, res) {

    FroalaEditor.Video.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

app.post('/delete_file', function (req, res) {

    FroalaEditor.File.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

app.get('/load_images', function (req, res) {

    FroalaEditor.Image.list('/uploads/', function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.send(data);
    });
});


app.get('/get_amazon', function (req, res) {

    var configs = {
        bucket: process.env.AWS_BUCKET,
        region: process.env.AWS_REGION,
        keyStart: process.env.AWS_KEY_START,
        acl: process.env.AWS_ACL,
        accessKey: process.env.AWS_ACCESS_KEY,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY
    }

    var configsObj = FroalaEditor.S3.getHash(configs);
    res.send(configsObj);
});

// Create folder for uploading files.
var filesDir = path.join(path.dirname(require.main.filename), 'uploads');
if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
}


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function verify_token(token) {
    for (let i = session.length - 1; i >= -1; i--) {
        if(session[i].token == token) {
            return true;
        }
    }
    return false;
}

function verify_main_uuid(uuid) {
    for (let menu of data_config) {
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