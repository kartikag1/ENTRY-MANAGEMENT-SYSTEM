var mongoose = require("mongoose");
 require('dotenv').config();

mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true ,useUnifiedTopology: true});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("connected to db sucessfully");
});

// mongoDB setup ------------------------------------------------
var Schema = mongoose.Schema;
var host = new Schema({
  host_name: { type: String }, 
  host_email: { type: String },
  host_phone: { type: String },
  date: { type: Date }
});
var hostt = mongoose.model("hosts", host);

var visitor = new Schema({
  visitor_name: { type: String }, 
  visitor_email: { type: String },
  visitor_phone: { type: String },
  checkin: { type: Date },
  checkout: { type: Date },
  host_name: { type: String } 
});
var visitorr = mongoose.model("visitors", visitor);
// --------------------------------------------------------------

module.exports.hostt = hostt;
module.exports.visitorr = visitorr;