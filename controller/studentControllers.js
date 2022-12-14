const res = require("express/lib/response");
var CourseModel = require("../model/CourseModel");
const StudentModel = require("../model/studentModels"); 
var StudentCourse = require("../model/StudentCourse");

async function getUser(req){
    std= await StudentModel.findById(req.session.student_id);
    return std;
}
function insertStudent(req,res){
    var student =new StudentModel({
        name:req.body.name,
        father:req.body.father,
        email:req.body.email,
        contact:req.body.contact,
        address:req.body.address,
        gender:req.body.gender,
        education:req.body.education,
        password:req.body.password
    });
    student.save();
    res.redirect("/apply");
}
async function Home(req,res){
    var data = await CourseModel.find({}).populate("category_id");
    res.render("home",{"courses": data})
}

async function studentHome(req,res){
    data = await getUser(req);
    vs = await StudentCourse.find({'studentId':data}).populate("courseId").populate("studentId");
    res.render("student/home",{"students":data , 'StudentCourse':vs});
}

function studentLogin(req,res) {
    res.render("student/login")
}
async function studentLoginCheck(req, res) {
    var {email,password} = req.body;
    console.log(email);
    console.log(password);
    var account = await StudentModel.findOne({email: email});
    console.log(account)
    if (account.email === email && account.password === password) {
        req.session.student_id = account._id;
        res.redirect('/student/homes');
    } else {
        res.send("wrong");
    }
}

function LogoutStudent(req,res){
    req.session.destroy();
     res.redirect("/student/login");
}
module.exports ={
    Home,
    studentLoginCheck,
    studentHome,
    studentLogin,
    insertStudent,
    LogoutStudent,
}