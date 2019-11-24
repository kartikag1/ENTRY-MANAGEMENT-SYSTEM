var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");
var ejs = require("ejs");
 var fs = require('fs');
 var models = require("./models/app");
 var hostt = models.hostt;
 var visitorr = models.visitorr;
 var nodemailer = require('nodemailer');
 require('dotenv').config();

     var myCss = {
         style : fs.readFileSync('./public/css/index.css','utf8')
     };



// data flow ------>>

// mail to host: - visitor_name,visitor_email,visitor_phone,check_in_time
// mail to visitor: - visitor_name,visitor_phone,check_in_time,check_out_time,host_name,address



 
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDING_EMAIL,
    pass: process.env.SENDING_EMAIL_PASS
  }
});

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
var hname;
  var hemail;
  var hphone;
  var add ;
  var vname;
  var vemail;
  var vphone;


app.get('/',(req,res)=>{
	res.render("index", {
       title: 'My Site',
       myCss: myCss
      });
});

app.post('/submit',(req,res)=>{
	 hname=req.body.hname;
	 hemail=req.body.hemail;
	 hphone=req.body.hphone;
	 add = req.body.address;
	 vname=req.body.vname;
	 vemail=req.body.vemail;
	 vphone=req.body.vphone;

	hostt.find({host_name:hname,host_email:hemail,host_phone:hphone},(err,docs)=>{
		if(!err && !docs.length)
		{
			hostt.create({host_name:hname,host_email:hemail,host_phone:hphone,date:Date()},(err,data)=>{});
		}
	});
  const dt = Date();
	visitorr.create({visitor_name:vname,visitor_email:vemail,visitor_phone:vphone,checkin:dt,host_name:hname},(err,docs)=>{});

	let mailOptions = {
    from: process.env.SENDING_EMAIL,
    to: hemail,
    subject: 'VISITOR INFORMATION',
    text: "VISITOR NAME: "+vname+"\nVISITOR E-MAIL: "+vemail+"\nVISITOR PHONE: "+vphone+"\nCHECK-IN TIME: "+dt
  };

  transporter.sendMail(mailOptions, (err,data)=>{
    if(err) throw err;
      console.log("sent");
  })

  // sms------------------------------------------------------------------------------------------


  //----------------------------------------------------------------------------------------------

	res.render('home');
});


app.post('/out',(req,res)=>{
  const dtt = Date();
  var xx = {'checkout':dtt};
  visitorr.findOneAndUpdate({visitor_name:vname,visitor_email:vemail,visitor_phone:vphone,host_name:hname},xx,{upsert:true},(err,dataa)=>{
	// add the mail to be sent to visitor
  visitorr.find({visitor_name:vname,visitor_email:vemail,visitor_phone:vphone,host_name:hname},(err,docx)=>{
  let mailOptions = {
    from: process.env.SENDING_EMAIL,
    to: vemail,
    subject: 'VISIT INFORMATION',
    text: "VISITOR NAME: "+vname+"\nVISITOR PHONE: "+vphone+"\nCHECK-IN TIME: "+docx[0].checkin+"\nCHECK-OUT TIME: "+docx[0].checkout+"\nHOST NAME: "+hname+"\nADDRESS: "+add
  };

  transporter.sendMail(mailOptions, (err,data)=>{
    if(err) throw err;
      console.log("sent");
  })

// sms--------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------


});

});
  res.redirect('/');
})





console.log('app running on PORT 5k')
app.listen(process.env.PORT || 5000);