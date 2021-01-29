var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

module.exports.verifyTa = async function(req,res){
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
            if(user.role=="admin"){
                
                let create_obj = {
                    ta_id: req.body.ta_id
                }

                for (var i in create_obj){
                    if (!create_obj[i]){
                        console.log("No "+i);
                        res.status(500).json({
                            success : false,
                            message : i + " is a required field"
                        });
                        return;
                    }
                }

                let value = await db.public.taUsers.findOne({
                    where : {ta_id : create_obj.ta_id}
                })

                if (!value){
                    res.status(500).json({
                        success : false,
                        message : "Ta_Id does not exist"
                    });
                    return;
                }

                try {
                    let update_ta = await db.public.taUsers.update({status_verified : true},{
                        where : {ta_id : create_obj.ta_id}
                    }).then(updated=>{
                        db.public.coursesMapping.update({status_verified : true},{
                            where : {user_id : create_obj.ta_id,
                                    user_role: "Teaching_Assistant"}
                        })

                        res.status(200).json({
                            success : true,
                            message : "TA Verified Successfully"
                        })

                    })
            

                }
                catch (err){
                    console.log(err);
                    res.status(500).json({
                        success : false,
                        description : err.description
                    })
                }

            }else{
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Not enough permission levels"
                    }
                });
            }

           }
           catch(err){
               console.log(err)
                res.status(500).json({
                    success: false,
                    error: {
                        message: "invalid Token"
                    }
                });
           }

    }catch(err){

        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error"
            }
        });

    }

}

module.exports.addLabCourse = function(req,res){
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
            if(user.role=="admin"){

                let create_obj = {
                    course_code: req.body.course_code,
                    lab_title: req.body.lab_title,
                    lab_marks: req.body.lab_marks,
                }

                for (var i in create_obj){
                    if (!create_obj[i]){
                        console.log("No "+i);
                        res.status(500).json({
                            success : false,
                            message : i + " is a required field"
                        });
                        return;
                    }
                }

                console.log(user.email)
                create_obj.created_by = user.email
                let query = {course_code:create_obj.course_code}

                db.public.courses.findAll({
                    where: query
                }).then(courses=>{
                    if(courses.length > 0){
                        create_obj.course_id = courses[0].course_id

                        db.public.labs.create(create_obj).then(labs_data => {
                            var data = {
                                course_code: labs_data.course_code,
                                lab_title: labs_data.lab_title,
                                id: labs_data.id,
                                created_at: new Date()
                            };
                
                            res.status(200).json({
                                success: true,
                                message: "Lab Succssfully added",
                                labs: data
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
                            message: "No such courses found",
                        });
                    }
                })
                
            }else{
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Not enough permission levels",
                    }
                });
            }

        }catch(err){
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                    description: err, 
                }
            });
        }

    }catch(err){
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                description: err, 
            }
        });

    }
}


module.exports.getLabsStudent = async function(req,res){
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
            let query = {}

            if(req.query.course_code){
                query.course_code = req.query.course_code
            }

            let labs = await db.public.labs.findAll({
                where: query
            })

            res.status(200).json({
                success: true,
                labs: labs
            });

        }catch(err){
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                    description: desc, 
                }
            });
        }

    }catch(err){
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                description: desc, 
            }
        });

    }
}


module.exports.deleteLabs = async function(req,res){
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
            if(user.role=="admin"){
                let create_obj = {
                    lab_id: req.body.lab_id
                }

                for (var i in create_obj){
                    if (!create_obj[i]){
                        console.log("No "+i);
                        res.status(500).json({
                            success : false,
                            message : i + " is a required field"
                        });
                        return;
                    }
                }

                try{
                    db.public.labs.destroy({
                        where : {lab_id : create_obj.lab_id}
                    }).then(deletedlabs =>{
                        console.log(deletedlabs)

                        if(deletedlabs==0){
                            res.status(500).json({
                            success: false,
                            error:"record not found"
                         });
                        }else{
                            db.public.marks.destroy({
                                where: {lab_id:create_obj.lab_id}
                            }).then(deletedMarks => {
                                res.status(200).json({
                                    success: true,
                                    message:"Lab succesfullly deleted"
                                 });
                            })
                        }
                    })
                }catch(err){
                    console.log(err)
                    res.status(500).json({
                        success : false,
                        message : err.desc
                    });
                }

            }else{
                res.status(500).json({
                    success: false,
                    error: {
                        message: "You dont have enough permissions",
                    }
                });
            }

        }catch(err){
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    }catch(err){
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}

module.exports.updateLeaderboardActive = async function(req,res){
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
            if(user.role=="admin"){

                let create_obj = {
                    lab_id: req.body.lab_id,
                    active: req.body.active
                }

                for (var i in create_obj){
                    if (!create_obj[i]){
                        console.log("No "+i);
                        res.status(500).json({
                            success : false,
                            message : i + " is a required field"
                        });
                        return;
                    }
                }

                try{
                    if(create_obj.active==1){
                        update_obj = {
                            leaderboard_active:true
                        }
                        db.public.labs.update(update_obj,{
                            where: {lab_id:create_obj.lab_id}
                        }).then(response=>{
                            if(response!=0){
                                res.status(200).json({
                                    success: true,
                                    message: "Leaderboard Successfully activated",
                                });
                            }else{
                                res.status(500).json({
                                    success: false,
                                    message: "lab Id not found",
                                });
                            }
 
                        })
                    }else if(create_obj.active==0){
                        update_obj = {
                            leaderboard_active:false
                        }
                        db.public.labs.update(update_obj,{
                            where: {lab_id:create_obj.lab_id}
                        }).then(response=>{
                            res.status(200).json({
                                success: true,
                                message: "Leaderboard Successfully deactivated",
                            });
                        })
                    }else{
                        res.status(200).json({
                            success: false,
                            message: "Active value should be correct",
                        });
                    }
                    
                }catch(err){
                    console.log(err)
                    res.status(200).json({
                        success: false,
                        message: "Internal Server Error",
                    });
                }

            }else{
                res.status(200).json({
                    success: false,
                    message: "Not enough permission levels",
                });
            }

        }catch(err){
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    }catch(err){
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}










module.exports.updateTAEditing = async function(req,res){
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
            if(user.role=="admin"){

                let create_obj = {
                    lab_id: req.body.lab_id,
                    active: req.body.active
                }

                for (var i in create_obj){
                    if (!create_obj[i]){
                        console.log("No "+i);
                        res.status(500).json({
                            success : false,
                            message : i + " is a required field"
                        });
                        return;
                    }
                }

                try{
                    if(create_obj.active==1){
                        update_obj = {
                            editing_active:true
                        }
                        db.public.labs.update(update_obj,{
                            where: {lab_id:create_obj.lab_id}
                        }).then(response=>{
                            res.status(200).json({
                                success: true,
                                message: "Editing Successfully activated",
                            });
                        })
                    }else if(create_obj.active==0){
                        update_obj = {
                            editing_active:false
                        }
                        db.public.labs.update(update_obj,{
                            where: {lab_id:create_obj.lab_id}
                        }).then(response=>{
                            res.status(200).json({
                                success: true,
                                message: "Editing Successfully deactivated",
                            });
                        })
                    }else{
                        res.status(200).json({
                            success: false,
                            message: "Active value should be correct",
                        });
                    }
                    
                }catch(err){
                    res.status(200).json({
                        success: false,
                        message: "Internal Server Error",
                    });
                }

            }else{
                res.status(200).json({
                    success: false,
                    message: "Not enough permission levels",
                });
            }

        }catch(err){
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    }catch(err){
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}