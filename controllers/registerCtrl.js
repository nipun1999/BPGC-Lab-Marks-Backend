var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var shortid = require('shortid'); // shortid() or shortid.generate(); to generate a short id
// var uuidv4 = require('uuid/v4'); // UUID generator; uuidv4(); to generate the uuid
var nunjucks = require("nunjucks");
var fs = require('fs');
var path = require('path');

var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


module.exports.adminRegister = async function(req, res){

    var create_object = {
        email: req.body.email,
        first_name: req.body.name,
        password: req.body.password,
        course_code: req.body.course_code,
    };

    secret_code = req.body.secret

    for (var i in create_object) {
        if (!create_object[i]) {
            console.log("No " + i);
            res.status(500).json({
                success: false,
                message: i + " is a required field"
            });
            return;
        }
    }

    //checking for email

    db.public.adminUsers.findAll({
        where: {
            [db.public.Op.or]: [{
                    email: create_object.email
                }
            ]
        }
    }).then(existingUser => {
        console.log("The existing users are");
        if (existingUser.length > 0) {
            console.log("The email already exists");
            console.log(create_object);
            res.status(200).json({
                success: false,
                message: "The user with the email already exists"
            });
            return;
        }

        if(secret_code=='eat_sleep_code'){

            var salt = crypto.randomBytes(16).toString('hex');
            var password = crypto.pbkdf2Sync(create_object.password, salt, 1000, 512, "sha512").toString('hex');
    
            create_object.password = password; // Hashed password.
            create_object.salt = salt;
    
            db.public.adminUsers.create(create_object).then(login_data => {
                var auth_data = {
                    role: login_data.role,
                    email: login_data.email,
                    id: login_data.id,
                    created_at: new Date()
                };
    
                var token = jwt.sign(auth_data, config.app.jwtKey);
    
                res.status(200).json({
                    success: true,
                    token: token
                });
            }).catch(function (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: err
                });
            });

        }else{
            res.status(200).json({
                success: false,
                message: "Secret code is not correct"
            });
        }


    }).catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    })

};



module.exports.taRegister = async function(req,res){
    
    var create_object = {
        email: req.body.email,
        first_name: req.body.name,
        password: req.body.password,
        ta_id: req.body.ta_id,
    };


    for (var i in create_object) {
        if (!create_object[i]) {
            console.log("No " + i);
            res.status(500).json({
                success: false,
                message: i + " is a required field"
            });
            return;
        }
    }


    db.public.taUsers.findAll({
        where: {
            [db.public.Op.or]: [{
                    email: create_object.email
                }
            ]
        }
    }).then(existingUser => {
        console.log("The existing users are");
        if (existingUser.length > 0) {
            console.log("The email already exists");
            console.log(create_object);
            res.status(200).json({
                success: false,
                 message: "The user with the email already exists"
            });
            return;
        }

        var salt = crypto.randomBytes(16).toString('hex');
        var password = crypto.pbkdf2Sync(create_object.password, salt, 1000, 512, "sha512").toString('hex');

        create_object.password = password; // Hashed password.
        create_object.salt = salt;

        db.public.taUsers.create(create_object).then(login_data => {
            var auth_data = {
                role: login_data.role,
                email: login_data.email,
                id: login_data.id,
                created_at: new Date()
            };

            var token = jwt.sign(auth_data, config.app.jwtKey);

            res.status(200).json({
                success: true,
                token: token
            });
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "BITS ID Already Exists"
            });
        });


    }).catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    })



}


module.exports.studentRegister = async function(req,res){
    
    var create_object = {
        email: req.body.email,
        first_name: req.body.name,
        student_id: req.body.student_id,
        password: req.body.password,
    };


    for (var i in create_object) {
        if (!create_object[i]) {
            console.log("No " + i);
            res.status(500).json({
                success: false,
                message: i + " is a required field"
            });
            return;
        }
    }


    db.public.studentUsers.findAll({
        where: {
            [db.public.Op.or]: [{
                    email: create_object.email
                }
            ]
        }
    }).then(existingUser => {
        console.log("The existing users are");
        // console.log(existingUser);
        if (existingUser.length > 0) {
            console.log("The email already exists");
            console.log(create_object);
            res.status(200).json({
                success: false,
                message: "The user with the email already exists"
            });
            return;
        }

        var salt = crypto.randomBytes(16).toString('hex');
        var password = crypto.pbkdf2Sync(create_object.password, salt, 1000, 512, "sha512").toString('hex');

        create_object.password = password; // Hashed password.
        create_object.salt = salt;

        db.public.studentUsers.create(create_object).then(login_data => {
            var auth_data = {
                role: login_data.role,
                email: login_data.email,
                id: login_data.id,
                created_at: new Date()
            };

            var token = jwt.sign(auth_data, config.app.jwtKey);

            res.status(200).json({
                success: true,
                token: token
            });
        }).catch(function (err) {
            console.log(err);
            res.status(200).json({
                success: false,
                message: "A student with this ID already exists"
            });
        });


    }).catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    })



}