var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


module.exports.addCourses = async function(req,res){
    
    try{
            try{
                    var create_obj = {
                        course_title: req.body.course_title,
                        course_code: req.body.course_code,
                        course_instructor: req.body.course_instructor
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

                    db.public.courses.findAll({
                        where: {
                            [db.public.Op.or]: [{
                                    course_code: create_obj.course_code,
                                    course_title: create_obj.course_title
                                }
                            ]
                        }
                    }).then(existingCourse =>{
                        if (existingCourse.length > 0) {
                            console.log("The course already exists");
                            console.log(create_obj);
                            res.status(200).json({
                                success: false,
                                message: "The course with same course_code already exists"
                            });
                            return;
                        }
                        db.public.courses.create(create_obj).then(course_data => {
                            var data = {
                                course_code: course_data.course_code,
                                course_title: course_data.course_title,
                                id: course_data.id,
                                created_at: new Date()
                            };
                
                            res.status(200).json({
                                success: true,
                                message: "Course Succssfully added",
                                course: data
                            });
                        }).catch(function (err) {
                            console.log(err);
                            res.status(500).json({
                                success: false,
                                message: err
                            });
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            success: false,
                            message: "Internal Server Error"
                        })
                    })            
            
            }catch(err){
                console.log(err)
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Invalid Token Passed"
                    }
                });
            }


    }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            error: {
                message: err
            }
        });   
    }
}



module.exports.getCourses = async function(req,res){

    try{

        try{
            let query = {};

            if(req.query.course_code){
                query.course_code = req.query.course_code;
            }

            let courses = await db.public.courses.findAll({
                where: query
            })

            res.status(200).json({
                success: true,
                course: courses
            });


        }catch(err){
            console.log(err)
            res.status(500).json({
                success: false,
                error: {
                    message: "Invalid Token passed"
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


module.exports.assignTa = async function(req,res){
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
            var user = utilities.decryptJWTWithToken(authTOKEN);
            if(user.role=="admin"){
                var create_obj = {
                    course_code: req.body.course_code,
                    user_id: req.body.user_id,
                    user_role: req.body.user_role, 
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


                db.public.coursesMapping.findAll({
                    where: {
                        [db.public.Op.and]: [{
                            course_code: create_obj.course_code,
                            user_id: create_obj.user_id,
                        }
                    ]
                    }
                }).then(data =>{
                    if(data.length==0){
                        db.public.courses.findAll({
                            where: {
                                [db.public.Op.or]: [{
                                        course_code: create_obj.course_code,
                                    }
                                ]
                            }
                        }).then(existingCourse =>{
                            if(existingCourse.length > 0){
                                console.log(create_obj.user_role)

                                if(create_obj.user_role=="student"){
                                    console.log("inside student")
                                    db.public.studentUsers.findAll({
                                        where: {
                                            [db.public.Op.or]: [{
                                                    student_id: create_obj.user_id,
                                                }
                                            ]
                                        }
                                    }).then(existingUser =>{
                                        if(existingUser.length > 0){
                                            create_obj.course_id = existingCourse[0].course_id
                                            create_obj.course_title = existingCourse[0].course_title
                                            create_obj.user_name = existingUser[0].first_name
                                            db.public.coursesMapping.create(create_obj).then(courseMapping =>{
                                                res.status(200).json({
                                                    success: true,
                                                    message: "User Succssfully Mapped to the Course",
                                                });
                                            })
                                        }else{
                                            res.status(200).json({
                                                success: false,
                                                message: "User does not exists"
                                            });
                                            return
                                        }
                                    })
                                }else if(create_obj.user_role=="Teaching_Assistant"){
                                    console.log("inside teacher")
                                    db.public.taUsers.findAll({
                                        where: {
                                            [db.public.Op.or]: [{
                                                    ta_id: create_obj.user_id,
                                                }
                                            ]
                                        }
                                    }).then(existingUser =>{
                                        if(existingUser.length > 0){
                                            // if(existingUser[0].status_verified){
                                                create_obj.course_id = existingCourse[0].course_id
                                                create_obj.course_title = existingCourse[0].course_title
                                                create_obj.status_verified = existingUser[0].status_verified
                                                create_obj.user_name = existingUser[0].first_name
                                                db.public.coursesMapping.create(create_obj).then(courseMapping =>{
                                                    res.status(200).json({
                                                        success: true,
                                                        message: "User Succssfully Mapped to the Course",
                                                    });
                                                })
                                            // }else{
                                            //     res.status(200).json({
                                            //         success: true,
                                            //         message: "User is not verified as Teaching_Assistant",
                                            //     }); 
                                            // }
                                        }else{
                                            res.status(200).json({
                                                success: false,
                                                message: "User does not exists"
                                            });
                                            return
                                        }
                                    })
        
                                }else{
                                    res.status(200).json({
                                        success: false,
                                        message: "User_role is not correct"
                                    });
                                    return
                                }
                            }else{
                                res.status(200).json({
                                    success: false,
                                    message: "Course does not exists"
                                });
                                return
                            }
                        })

                    }else{
                        res.status(200).json({
                            success: false,
                            message: "User already exists with same role and course",
                        });
                        
                    }
                })

            }else{
                res.status(200).json({
                    success: false,
                    message: "Not enough permission levels"
                });
            }

            
        }catch(err){
            res.status(200).json({
                success: false,
                message: "Invalid Token Passed"
            });
        }

    }catch(err){

        console.log(err)
        res.status(500).json({
            success: false,
            error: {
                message: err
            }
        });  

    }
}



module.exports.getAllTaCourse = async function(req,res){

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
            let query = {user_role:"Teaching_Assistant"}

            if(req.query.course_code){
                query.course_code = req.query.course_code
            }

            
            console.log(query)
            let tas = await db.public.coursesMapping.findAll({
                where: query
            })

            res.status(200).json({
                success: true,
                course: tas
            });

        }catch(err){
            res.status(500).json({
                success: false,
                error: {
                    message: "Invalid token passed"
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


module.exports.getAllStudentCourse = async function(req,res){    
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
            let query = {user_role:"student"}

            if(req.query.course_code){
                query.course_code = req.query.course_code
            }

            
            console.log(query)
            let tas = await db.public.coursesMapping.findAll({
                where: query
            })

            res.status(200).json({
                success: true,
                course: tas
            });

        }catch(err){
            res.status(500).json({
                success: false,
                error: {
                    message: "Invalid token passed"
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

module.exports.getAllCoursesStudent = async function(req,res){

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
            let query = {user_role:"student"}

            if(req.query.user_id){
                query.user_id = req.query.user_id
            }

            console.log(query)
            let students = await db.public.coursesMapping.findAll({
                where: query
            })

            res.status(200).json({
                success: true,
                course: students
            });


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


module.exports.getAllCoursesTa = async function(req,res){

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
            let query = {user_role:"Teaching_Assistant"}

            if(req.query.user_id){
                query.user_id = req.query.user_id
            }

            console.log(query)
            let students = await db.public.coursesMapping.findAll({
                where: query
            })

            res.status(200).json({
                success: true,
                course: students
            });

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
