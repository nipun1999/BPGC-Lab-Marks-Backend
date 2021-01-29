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


module.exports.studentLogin = async function (req, res) {

    if (!req.body.student_id || !req.body.password) {
        console.log(req.body);
        res.status(500).json({
            success: false,
            message: "All fields are required"
        });
        return;
    }

    
    var id = req.body.student_id;

    let user = await db.public.studentUsers.findOne({
            where: {
                student_id: id
            }
        })
        // .then(user => {
    if (user) {
        console.log(user.id);
        password = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 512, "sha512").toString('hex');

        if (user.password === password) {
            // Get user profile
            
            var auth_data = {
                role: user.role,
                student_id: user.student_id,
                email: user.email,
                name:user.first_name,
                created_at: new Date()
            };
            
            var token = jwt.sign(auth_data, config.app.jwtKey);
            
            res.status(200).json({
                success: true,
                auth: auth_data,
                token: token,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Incorrect Password. Please try again."
            });
        }

    } else {
        res.status(200).json({
            success: false,
            message: "We could not find your account."
        });
    }

};


module.exports.adminLogin = async function (req, res) {

    if (!req.body.email || !req.body.password) {
        console.log(req.body);
        res.status(500).json({
            success: false,
            message: "All fields are required"
        });
        return;
    }

    var email = req.body.email;

    let user = await db.public.adminUsers.findOne({
            where: {
                email: email
            }
        })
        // .then(user => {
    if (user) {
        console.log(user.id);
        password = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 512, "sha512").toString('hex');

        if (user.password === password) {
            // Get user profile
            
            var auth_data = {
                role: user.role,
                email: user.email,
                course: user.course_code,
                name: user.first_name,
                created_at: new Date()
            };
            
            var token = jwt.sign(auth_data, config.app.jwtKey);
            
            res.status(200).json({
                success: true,
                auth: auth_data,
                token: token,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Incorrect Password. Please try again."
            });
        }

    } else {
        res.status(200).json({
            success: false,
            message: "We could not find your account."
        });
    }

};


module.exports.taLogin = async function (req, res) {

    if (!req.body.ta_id || !req.body.password) {
        console.log(req.body);
        res.status(500).json({
            success: false,
            message: "All fields are required"
        });
        return;
    }

    var id = req.body.ta_id;

    let user = await db.public.taUsers.findOne({
            where: {
                ta_id: id
            }
        })
        // .then(user => {
    if (user) {
        console.log(user.id);
        password = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 512, "sha512").toString('hex');

        if (user.password === password) {
            // Get user profile
            
            var auth_data = {
                role: user.role,
                email: user.email,
                ta_id: user.ta_id,
                name: user.first_name,
                created_at: new Date()
            };
            
            var token = jwt.sign(auth_data, config.app.jwtKey);
            
            res.status(200).json({
                success: true,
                auth: auth_data,
                token: token,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Incorrect Password. Please try again."
            });
        }

    } else {
        res.status(200).json({
            success: false,
            message: "We could not find your account."
        });
    }

};