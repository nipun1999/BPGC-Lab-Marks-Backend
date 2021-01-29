var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


module.exports.get_Student_profile = async function (req, res) {
    
   try{
    var authTOKEN = req.header('X-AUTH-TOKEN');
    if(authTOKEN == "" || authTOKEN == null)
    {
        res.status(500).json({
            success: false,
            error: {
                message: "Token not passed"
            }
        });
    }

   try{
    var user = utilities.decryptJWTWithToken(authTOKEN)

    let query = {};

    if(req.query.student_id){
        query.student_id = req.query.student_id;
    }

    if(req.query.email){
        query.email = req.query.email;
    }

    let profiles = await db.public.studentUsers.findAll({
        where: query
    })

    if(profiles[0]) {
        console.log('Profile exists')
    }
    else {
        console.log('No Profile Exists')
    }

    res.status(200).json({
        success: true,
        profile: profiles
    });

   }catch(err){
    
        res.status(500).json({
            success: false,
            error: {
                message: "Invalid Token Passed"
            }
        });

   }

   }catch(err){
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                description: err.description
            }
        });
   }
    

}



module.exports.get_Ta_Profile = async function (req, res) {
    
    try{
     var authTOKEN = req.header('X-AUTH-TOKEN');
     if(authTOKEN == "" || authTOKEN == null)
     {
         res.status(500).json({
             success: false,
             error: {
                 message: "Token not passed"
             }
         });
     }
 
    try{
     var user = utilities.decryptJWTWithToken(authTOKEN)
 
     let query = {};
 
     if(req.query.ta_id){
         query.ta_id = req.query.ta_id;
     }
 
     if(req.query.email){
         query.email = req.query.email;
     }
 
     let profiles = await db.public.taUsers.findAll({
         where: query
     })
 
     if(profiles[0]) {
         console.log('Profile exists')
     }
     else {
         console.log('No Profile Exists')
     }
 
     res.status(200).json({
         success: true,
         profile: profiles
     });
 
    }catch(err){
     
         res.status(500).json({
             success: false,
             error: {
                 message: "Invalid Token Passed"
             }
         });
 
    }
 
    }catch(err){
         res.status(500).json({
             success: false,
             error: {
                 message: "Internal Server Error",
                 description: err.description
             }
         });
    }
     
 
 }

 module.exports.get_Admin_Profile = async function (req, res) {
    
    try{
     var authTOKEN = req.header('X-AUTH-TOKEN');
     if(authTOKEN == "" || authTOKEN == null)
     {
         res.status(500).json({
             success: false,
             error: {
                 message: "Token not passed"
             }
         });
     }
 
    try{
     var user = utilities.decryptJWTWithToken(authTOKEN)
 
     let query = {};
 
     if(req.query.id){
         query.id = req.query.id;
     }
 
     if(req.query.email){
         query.email = req.query.email;
     }
 
     let profiles = await db.public.adminUsers.findAll({
         where: query
     })
 
     if(profiles[0]) {
         console.log('Profile exists')
     }
     else {
         console.log('No Profile Exists')
     }
 
     res.status(200).json({
         success: true,
         profile: profiles
     });
 
    }catch(err){
     
         res.status(500).json({
             success: false,
             error: {
                 message: "Invalid Token Passed"
             }
         });
 
    }
 
    }catch(err){
         res.status(500).json({
             success: false,
             error: {
                 message: "Internal Server Error",
                 description: err.description
             }
         });
    }
     
 
 }


