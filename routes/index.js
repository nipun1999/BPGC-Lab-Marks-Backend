var express = require('express');
var router = express.Router();

// var themes = require("../controllers/themeCtrl");
// var atcStrip = require("../controllers/atcStripCtrl");
var atc = require("../controllers/atc-strips-no-cache");
var crud = require("../controllers/crud");
var register = require("../controllers/registerCtrl")
var login = require("../controllers/loginsCtrl")
var labs = require("../controllers/labsCtrl")
var profile = require("../controllers/profileCtrl")
var courses = require("../controllers/coursesCtrl")
var marks = require("../controllers/marksCtrl")
var app = require("../app")


// // Login and onboarding
// router.post("/register", login.register);
// router.post("/login", login.login);


// // ATC and the ATC Strips
// router.get('/atc/strips', atc.getAll);
// router.get('/atc/progress/strip', atc.get);
// router.post('/atc/strip/create', atc.create);
// router.delete('/atc/strip/delete', atc.delete);

// router.post("/request/permission", login.requestPermission);
// router.post("/grant/permission", login.allotPermission);
// router.get("/get/user/team", login.getUserTeams);
// router.get('/search/user', login.userFullTs);

router.post('/registerAdmin', register.adminRegister);
router.post('/registerTa',register.taRegister);
router.post('/registerStudent',register.studentRegister);
router.post('/loginStudent',login.studentLogin);
router.post('/loginTa',login.taLogin);
router.post('/verifyTa',labs.verifyTa);
router.post('/loginAdmin',login.adminLogin);
router.get('/getStudentProfile',profile.get_Student_profile);
router.get('/getTaProfile',profile.get_Ta_Profile);
router.get('/getAdminProfile',profile.get_Admin_Profile);
router.post('/addCourse',courses.addCourses);
router.get('/getCourse',courses.getCourses);
router.post('/addUserToCourse',courses.assignTa);
router.get('/getAllTaCourse',courses.getAllTaCourse);
router.get('/getAllStudentCourse',courses.getAllStudentCourse);
router.get('/getAllCoursesStudent',courses.getAllCoursesStudent);
router.get('/getAllCoursesTa',courses.getAllCoursesTa);
router.post('/addLab',labs.addLabCourse);
router.get('/getAllLabs',labs.getLabsStudent);
router.post('/addLabMark',marks.addMarks);
router.get('/getLabMarkStudent',marks.getLabMarksStudent);
router.get('/getAllMarksLab',marks.getAllMarksOfLab);
router.post('/verifyStudentMark',marks.verifyMarks);
router.post('/applyRecheck',marks.applyRecheck);
router.post('/updateMarks',marks.update_marks);
router.delete('/deleteMarks',marks.delete_student_marks);
router.delete('/deleteLab',labs.deleteLabs);
router.post('/calculateAverage',marks.calculateAverage);
router.post('/updateMarksAdmin',marks.update_marks);
router.post('/leaderboardActive',labs.updateLeaderboardActive);
router.post('/editingActive',labs.updateTAEditing);
router.post('/generateExcel',marks.generateExcelSheet);

module.exports = router;
