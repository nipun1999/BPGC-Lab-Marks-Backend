var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");
var excel = require('excel4node');
path = require('path')

let nodemailer = require('nodemailer')
let myEmail = "email"
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: myEmail,
        pass: "password"
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports.addMarks = async function (req, res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                message: "Token not passed"
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)
            if (user.role == "Teaching_Assistant") {

                let create_obj = {
                    lab_id: req.body.lab_id,
                    student_id: req.body.student_id,
                    marks: req.body.marks,
                }

                for (var i in create_obj) {
                    if (!create_obj[i]) {
                        console.log("No " + i);
                        res.status(500).json({
                            success: false,
                            message: i + " is a required field"
                        });
                        return;
                    }
                }

                create_obj.description = req.body.description;

                db.public.marks.findAll({
                    where: {
                        [db.public.Op.and]: [{
                            lab_id: create_obj.lab_id,
                            student_id: create_obj.student_id
                        }]
                    }
                }).then(existingMarks => {
                    console.log(existingMarks.length)
                    if (existingMarks.length > 0) {
                        res.status(200).json({
                            success: false,
                            message: "Marks have already been added for this lab",
                        });

                    } else {
                        db.public.labs.findAll({
                            where: {
                                lab_id: req.body.lab_id
                            }
                        }).then(existinglab => {
                            console.log(existinglab.length)
                            if (existinglab.length > 0) {
                                create_obj.course_code = existinglab[0].course_code
                                create_obj.verified = false,
                                    create_obj.max_marks = existinglab[0].lab_marks,
                                    create_obj.created_by = user.email
                                db.public.coursesMapping.findAll({
                                    where: {
                                        course_code: create_obj.course_code,
                                        user_id: create_obj.student_id
                                    }
                                }).then(existingUser => {
                                    if (existingUser.length > 0 && existingUser[0].user_role == "student") {
                                        console.log(existinglab[0].lab_marks)
                                        console.log(create_obj.marks)
                                        console.log(existingUser[0].user_name)
                                        create_obj.name = existingUser[0].user_name
                                        if (parseInt(create_obj.marks) < existinglab[0].lab_marks || parseInt(create_obj.marks) == existinglab[0].lab_marks) {
                                            db.public.marks.create(create_obj).then(data => {
                                                res.status(200).json({
                                                    success: true,
                                                    message: "Marks Successfully added"
                                                });
                                            })
                                        } else {
                                            res.status(200).json({
                                                success: false,
                                                message: "Marks Entered should be less than maximum marks"
                                            });
                                        }

                                    } else {
                                        res.status(200).json({
                                            success: false,
                                            message: "User is not Mapped to this Lab"
                                        });
                                    }
                                })

                            } else {
                                console.log(existinglab)
                                res.status(200).json({
                                    success: false,
                                    message: "No Such Labs exists",
                                });
                            }
                        })
                    }
                })

            } else {
                res.status(500).json({
                    success: true,
                    message: "Not enough permission levels",
                });
            }

        } catch (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                message: "Token entered is not correct",
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}






module.exports.getLabMarksStudent = async function (req, res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)
            let query = {}
            if (req.query.student_id) {
                query.student_id = req.query.student_id
            }

            if (req.query.course_code) {
                query.course_code = req.query.course_code
            }

            if (req.query.lab_id) {
                query.lab_id = req.query.lab_id
            }

            let marks = await db.public.marks.findAll({
                where: query
            })


            res.status(200).json({
                success: true,
                marks: marks
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}


module.exports.getAllMarksOfLab = async function (req, res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)
            let query = {}
            if (req.query.lab_id) {
                query.lab_id = req.query.lab_id
            }

            let marks = await db.public.marks.findAll({
                where: query
            })

            res.status(200).json({
                success: true,
                marks: marks
            });


        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}



module.exports.verifyMarks = async function (req, res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)

            if (user.role == "student") {

                let create_obj = {
                    student_id: req.body.student_id,
                    marks_id: req.body.marks_id,
                }


                for (var i in create_obj) {
                    if (!create_obj[i]) {
                        console.log("No " + i);
                        res.status(500).json({
                            success: false,
                            message: i + " is a required field"
                        });
                        return;
                    }
                }


                let value = await db.public.marks.findOne({
                    where: {
                        id: create_obj.marks_id
                    }
                })

                if (!value) {
                    res.status(500).json({
                        success: false,
                        message: "Marks_id does not exist"
                    });
                    return;
                }

                try {
                    if (value.student_id == create_obj.student_id) {
                        let update_marks = await db.public.marks.update({
                            verified: true
                        }, {
                            where: {
                                id: create_obj.marks_id
                            }
                        })

                        res.status(200).json({
                            success: true,
                            message: "Marks Successfully Updated"
                        })
                    } else {
                        res.status(500).json({
                            success: false,
                            message: "Cannot verify someone-else marks"
                        })
                    }

                } catch (err) {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        description: err.description
                    })
                }


            } else {
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Not enough permission levels",
                    }
                });
            }

        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}

module.exports.applyRecheck = async function (req, res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)
            if (user.role == "student") {

                let create_obj = {
                    student_id: req.body.student_id,
                    marks_id: req.body.marks_id,
                    recheck_comments: req.body.recheck_comments,
                }

                for (var i in create_obj) {
                    if (!create_obj[i]) {
                        console.log("No " + i);
                        res.status(500).json({
                            success: false,
                            message: i + " is a required field"
                        });
                        return;
                    }
                }

                let value = await db.public.marks.findOne({
                    where: {
                        id: create_obj.marks_id
                    }
                })

                if (!value) {
                    res.status(500).json({
                        success: false,
                        message: "Marks_id does not exist"
                    });
                    return;
                }

                try {
                    console.log(value.student_id)
                    if (value.student_id == create_obj.student_id) {

                        let recheck_marks = await db.public.marks.update({
                            verified: false,
                            recheck_request: true,
                            recheck_comments: create_obj.recheck_comments
                        }, {
                            where: {
                                id: create_obj.marks_id
                            }
                        })

                        res.status(200).json({
                            success: true,
                            message: "Successfully Applied for recheck"
                        })

                    } else {
                        res.status(500).json({
                            success: false,
                            message: "Only Same student can apply for re-check"
                        });
                        return;
                    }

                } catch (err) {
                    console.log(err)
                    res.status(500).json({
                        success: false,
                        message: err.desc
                    });
                }

            } else {
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Not enough permission levels",
                    }
                });
            }

        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}

module.exports.update_marks = async function (req, res) {

    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)
            if (user.role == "Teaching_Assistant" || user.role == "admin") {
                let create_obj = {
                    student_id: req.body.student_id,
                    marks_id: req.body.marks_id,
                    marks: req.body.marks,
                }

                for (var i in create_obj) {
                    if (!create_obj[i]) {
                        console.log("No " + i);
                        res.status(500).json({
                            success: false,
                            message: i + " is a required field"
                        });
                        return;
                    }
                }

                create_obj.description = req.body.description;

                let value = await db.public.marks.findOne({
                    where: {
                        id: create_obj.marks_id
                    }
                })

                if (!value) {
                    res.status(200).json({
                        success: false,
                        message: "Marks_id does not exist"
                    });
                    return;
                }

                if (value.max_marks < parseInt(create_obj.marks)) {
                    res.status(200).json({
                        success: false,
                        message: "Marks cannot be greater than the maximum marks entered"
                    });
                    return;
                }

                try {
                    if (value.student_id == create_obj.student_id) {
                        let recheck_marks = await db.public.marks.update({
                            verified: false,
                            recheck_request: false,
                            marks: create_obj.marks,
                            updated_by: user.email,
                            description: create_obj.description
                        }, {
                            where: {
                                id: create_obj.marks_id
                            }
                        })

                        res.status(200).json({
                            success: true,
                            message: "Successfully Updated Marks after recheck"
                        })

                    } else {
                        res.status(500).json({
                            success: false,
                            message: "Student_id does not match with the record"
                        });
                    }
                } catch (err) {
                    console.log(err)
                    res.status(500).json({
                        success: false,
                        message: err.desc
                    });
                }
            } else {
                res.status(200).json({
                    success: false,
                    message: "Not enough permission levels"
                });
            }


        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }

}


module.exports.delete_student_marks = async function (req, res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)
            if (user.role == "Teaching_Assistant" || user.role == "admin") {

                let create_obj = {
                    id: req.body.id
                }

                for (var i in create_obj) {
                    if (!create_obj[i]) {
                        console.log("No " + i);
                        res.status(500).json({
                            success: false,
                            message: i + " is a required field"
                        });
                        return;
                    }
                }

                try {

                    let delete_marks = await db.public.marks.destroy({
                        where: {
                            id: create_obj.id
                        }
                    })

                    console.log(delete_marks)

                    if (delete_marks == 0) {
                        res.status(200).json({
                            error: "record not found"
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            record: delete_marks,
                            deleted: true
                        });
                    }
                    
                } catch (err) {
                    console.log(err)
                    res.status(500).json({
                        success: false,
                        message: err.desc
                    });
                }

            } else {
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Not enough Permissions available",
                    }
                });
            }

        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}


module.exports.calculateAverage = async function (req, res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)
            let create_obj = {
                lab_id: req.body.lab_id
            }
            average = 0;
            count = 0;

            for (var i in create_obj) {
                if (!create_obj[i]) {
                    console.log("No " + i);
                    res.status(500).json({
                        success: false,
                        message: i + " is a required field"
                    });
                    return;
                }
            }

            let query = {}
            query.lab_id = create_obj.lab_id
            sum = 0
            db.public.marks.findAll({
                where: query
            }).then(labmarks => {
                for (i in labmarks) {
                    sum += labmarks[i].marks
                    count += 1
                }
                average = sum / count
                console.log(average)

                db.public.labs.update({
                    lab_average: average
                }, {
                    where: {
                        lab_id: create_obj.lab_id
                    }
                }).then(updatedMarks => {
                    res.status(200).json({
                        success: true,
                        average: average,
                        message: "Average for the lab has been updated",
                    });
                })

            })

        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }
}

module.exports.sendEmail = async function (req, res, next) {

    var fullPath = __dirname + '../' + filename;
    fullPath = path.join(__dirname, '../') + filename;
    console.log(fullPath);
    let message = {
        from: myEmail,
        to: 'agarwalnipun12@gmail.com',
        subject: "Message send from nodemailer",
        text: "Hey Shavon,this is a test",
        attachments: [{
            path: 'uploads/file_data.xlsx',
        }]
    }

    transport.sendMail(message, function (err, a) {
        if (err) {
            console.log("Failed to send email")
            console.log(err);
            return
        }
        console.log("Email sent");
        res.status(200).json({
            success: true,
            message: "Eamil has been sent " + a.response,
        });
    });
}


module.exports.generateExcelSheet = async function (req, res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if (authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }

        try {
            var user = utilities.decryptJWTWithToken(authTOKEN)
            if (user.role == "admin") {

                let create_obj = {
                    lab_id: req.body.lab_id,
                    email: req.body.email
                }

                for (var i in create_obj) {
                    if (!create_obj[i]) {
                        console.log("No " + i);
                        res.status(500).json({
                            success: false,
                            message: i + " is a required field"
                        });
                        return;
                    }
                }

                let response = await db.public.labs.findAll({
                    where: {
                        lab_id: create_obj.lab_id
                    }
                })

                if (response.length != 0) {
                    let lab_name = response[0].lab_title
                    let course_code = response[0].course_code
                    console.log(course_code)

                    var workbook = new excel.Workbook();
                    var worksheet = workbook.addWorksheet(lab_name);
                    var style = workbook.createStyle({
                        font: {
                            color: '#FF0800',
                            size: 12
                        },
                        numberFormat: '$#,##0.00; ($#,##0.00); -'
                    });
                    let query = {}
                    query.lab_id = create_obj.lab_id

                    worksheet.cell(1, 1).string('Name').style(style)
                    worksheet.cell(1, 2).string('ID').style(style)
                    worksheet.cell(1, 3).string('marks').style(style)
                    worksheet.cell(1, 6).string('created_by').style(style)
                    worksheet.cell(1, 7).string('updated_by').style(style)
                    worksheet.cell(1, 4).string('verified').style(style)
                    worksheet.cell(1, 5).string('recheck comments').style(style)
                    worksheet.cell(1, 8).string('created_At').style(style)
                    worksheet.cell(1, 9).string("updated_At").style(style)


                    let marks = await db.public.marks.findAll({
                        where: query
                    })
                    
                    let students = await db.public.coursesMapping.findAll({
                        where:{
                            course_code: course_code
                        }
                    })
                    var count = 1;
                    for(var j=0;j<students.length;j++){
                        var flag = 0;
                        
                        for (var i = 0; i < marks.length; i++) {
                            if(students[j].user_id==marks[i].student_id){
								count++;
                                flag=1;
                                var created_date = new Date(marks[i].created_at)
                                var updated_date = new Date(marks[i].updated_at)
                                worksheet.cell(count, 1).string(marks[i].name)
                                worksheet.cell(count, 2).string(marks[i].student_id)
                                worksheet.cell(count, 3).number(marks[i].marks)
                                worksheet.cell(count, 6).string(marks[i].created_by);
                                worksheet.cell(count, 4).string(marks[i].verified.toString());
                                if (marks[i].updated_by != null) {
                                    worksheet.cell(count, 7).string(marks[i].updated_by.toString());
                                }
                                if (marks[i].recheck_comments != null) {
                                    worksheet.cell(count, 5).string(marks[i].recheck_comments.toString());
                                }
                                worksheet.cell(count, 8).string(created_date.toString());
                                worksheet.cell(count, 9).string(updated_date.toString());
                            }
                        }
                        if(flag!=1){
                            if(students[j].user_role=="student"){
								count++;
                                worksheet.cell(count, 1).string(students[j].user_name)
                                worksheet.cell(count, 2).string(students[j].user_id)
                                worksheet.cell(count,3).string("ABSENT").style(style)
                            }
                        }
                    }

                     workbook.write('course_excel_sheets/' + course_code + " " + lab_name + ".xlsx");

                    //code to email excel file

                    let message = {
                        from: myEmail,
                        to: create_obj.email,
                        subject: "Lab Marks data for " + course_code + " " + lab_name,
                        text: "Hey, PFA the lab marks data for " + course_code + " " + "and " + lab_name + " Developed by DevSoc",
                        attachments: [{
                            path: 'course_excel_sheets/' + course_code+ " " + lab_name+".xlsx",
                        }]
                    }

                    transport.sendMail(message, function (err, a) {
                        if (err) {
                            console.log("Failed to send email")
                            console.log(err);
                            res.status(200).json({
                                success: false,
                                message: "Failed so send email",
                            });
                        }
                        console.log("Email sent");
                        res.status(200).json({
                            success: true,
                            message: "Email has been sent successfully",
                        });
                    });

                } else {
                    res.status(200).json({
                        success: false,
                        message: "No such labs found"
                    });
                }
            } else {
                res.status(200).json({
                    success: false,
                    message: "Not enough Permission levels"
                });
            }

        } catch (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                error: {
                    message: "Token entered is not correct",
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
            }
        });

    }


    // 

}