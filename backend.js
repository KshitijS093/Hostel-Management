const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs=require("ejs");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine","ejs");

app.use(session({
  secret:"Our Little Secret",
  resave:false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const uri = "mongodb://127.0.0.1:27017/personDB";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set("userCreateIndex",true);

const personSchema = new mongoose.Schema({
  name: String,
  password: String, // Changed password field to String for secure storage
});

personSchema.plugin(passportLocalMongoose);

const Person = new mongoose.model("Person", personSchema);

passport.use(Person.createStrategy());
passport.serializeUser(Person.serializeUser());
passport.deserializeUser(Person.deserializeUser());

const adminSchema = new mongoose.Schema({
  name: String,
  password: String, // Changed password field to String for secure storage
});

const Admin = new mongoose.model("Admin", adminSchema);


const complaintSchema = {
  username: String,
  complainttype: String,
  from: Number,
  to: Number,
  reasonForComplain: String,
  anythingElse: String
};
const Complaint = mongoose.model("Complaint", complaintSchema);

const lateComingSchema = {
  username: String,
  reasonForLateComing: String,
  currentLocation: String
};
const LateComming = mongoose.model("LateComming", lateComingSchema);

const leaveApplicationSchema = new mongoose.Schema({
  username: String,
  fromDate: Date,
  toDate: Date,
  reasonForLeave: String,
  emergencyContactNumber: String
});

const leaveApplication = mongoose.model("leaveApplication", leaveApplicationSchema);

const suggestionFormSchema = {
  username: String,
  day: String,
  meal: String,
  suggestions: String
};
const suggestionForm = mongoose.model("suggestionForm",suggestionFormSchema );

const profileSchema = {
  name: String,
  emailID: String,
  phoneNo: String,
  section1: String,
  section2: String,
  section3: String,
  ParentName: String,
  ParentRelation: String,
  ParentOccupation: String,
  ParentMobileNumber: String,
  ParentEmail: String,
  Address: String,
  HostelType: String,
  RoomNumber: String,
  RoomMateName: String,
  RoomMateMobileNo: String,
  RoomMateEmail: String,
  HostelAddress: String,
};

const profile = mongoose.model("profile",profileSchema );



app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/:links", (req, res) => {
  const requestedUrl = _.lowerCase(req.params.links);
  const fileMapping = {
    index: "index.html",
    afterloginhome: "after_login_home.html",
    latecomingform: "late_coming_form.html",
    admission: "admission.html",
    events: "events.html",
    finalcomplaint: "final_complaint.html",
    leaveapplicationform: "leave_application_form.html",
    login: "login.html",
    menu: "menu.html",
    mess: "mess.html",
    profilepage: "Profile_Page.html",
    suggestionsform: "suggestions_form.html",
    wardendetails: "wardendetails.html",
    admincomplaints:"admincomplaints.html",
    adminlogin:"adminlogin.html",
    adminleave:"adminleave.html",
    adminlatecoming:"adminlatecoming.html",
    adminmesssuggestion:"adminmesssuggestion.html",
    adminaddstudent:"adminaddstudent.html"
  };

  const fileName = fileMapping[requestedUrl];

  if (fileName) {
    res.sendFile(__dirname + "/" + fileName);
  } else {
    res.status(404).send("Page not found");
  }
});

// app.post("/userLoggingIn", async (req, res) => {
//     const username = req.body.lguser;
//     const password = req.body.password;
//     console.log(password);
//     try {
//       const foundPerson=await Person.findOne({name:username});
//       const person = await profile.findOne({emailID:username});
//       if(!foundPerson)
//       {
//         console.log("person not found");
//       }
//       if(foundPerson.password===password){
//         console.log("Person found");
//         // res.sendFile(__dirname+"/after_login_home.html");
//         res.render("profile",{name: person.name,
//           emailID: person.emailID,
//           phoneNo: person.phoneNo,
//           section1: person.section1,
//           section2: person.section2,
//           section3: person.section3,
//           ParentName: person.ParentName,
//           ParentRelation: person.ParentRelation,
//           ParentOccupation: person.ParentOccupation,
//           ParentMobileNumber: person.ParentMobileNumber,
//           ParentEmail: person.ParentEmail,
//           Address: person.Address,
//           HostelType: person.HostelType,
//           RoomNumber: person.RoomNumber,
//           RoomMateName: person.RoomMateName,
//           RoomMateMobileNo: person.RoomMateMobileNo,
//           RoomMateEmail: person.RoomMateEmail,
//           HostelAddress: person.HostelAddress});
//       }
//       else{
//         console.log("password is wrong");
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).send("Server error");
//     }
//   });

app.post("/userLoggingIn", async(req, res) => {
  const username = req.body.lguser;
    const password = req.body.password;
    console.log(password);
    try {
      const foundPerson=await Person.findOne({name:username});
      const person = await profile.findOne({emailID:username});
      if(!foundPerson)
      {
        console.log("person not found");
      }
      if(foundPerson.password===password){
        console.log("Person found");
        // res.sendFile(__dirname+"/after_login_home.html");
        res.cookie(`name`,req.body.lguser);
        res.cookie(`password`,req.body.password);
        console.log(req.cookies);
        res.render("profile",{name: person.name,
          emailID: person.emailID,
          phoneNo: person.phoneNo,
          section1: person.section1,
          section2: person.section2,
          section3: person.section3,
          ParentName: person.ParentName,
          ParentRelation: person.ParentRelation,
          ParentOccupation: person.ParentOccupation,
          ParentMobileNumber: person.ParentMobileNumber,
          ParentEmail: person.ParentEmail,
          Address: person.Address,
          HostelType: person.HostelType,
          RoomNumber: person.RoomNumber,
          RoomMateName: person.RoomMateName,
          RoomMateMobileNo: person.RoomMateMobileNo,
          RoomMateEmail: person.RoomMateEmail,
          HostelAddress: person.HostelAddress});
      }
      else{
        console.log("password is wrong");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
});

app.post("/adminLoggingIn", async(req, res) => {
  const username = req.body.lguser;
    const password = req.body.password;
    console.log(password);
    try {
      const foundPerson=await Admin.findOne({name:username});
      const person = await profile.findOne({emailID:username});
      if(!foundPerson)
      {
        console.log("person not found");
      }
      if(foundPerson.password===password){
        console.log("Person found");
        // res.sendFile(__dirname+"/after_login_home.html");
        res.render("admincomplaints");
      }
      else{
        console.log("password is wrong");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
});


// app.get("/profile", isLoggedIn, (req, res) => {
//   const person = req.user;
//   res.render("profile", {
//     name: person.name,
//     emailID: person.emailID,
//     phoneNo: person.phoneNo,
//     section1: person.section1,
//     section2: person.section2,
//     section3: person.section3,
//     ParentName: person.ParentName,
//     ParentRelation: person.ParentRelation,
//     ParentOccupation: person.ParentOccupation,
//     ParentMobileNumber: person.ParentMobileNumber,
//     ParentEmail: person.ParentEmail,
//     Address: person.Address,
//     HostelType: person.HostelType,
//     RoomNumber: person.RoomNumber,
//     RoomMateName: person.RoomMateName,
//     RoomMateMobileNo: person.RoomMateMobileNo,
//     RoomMateEmail: person.RoomMateEmail,
//     HostelAddress: person.HostelAddress
//   });
// });

// // Middleware to check if user is authenticated
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }


  app.post("/userComplaintIn", async (req, res) => {
    const username = req.cookies.name;
    const complainttype = req.body.complainttype;
    const fr = req.body.fr;
    const to = req.body.to;
    const roc = req.body.roc;
    const aos = req.body.aos;
    console.log(complainttype,fr,to,roc,aos);
    const complaint = new Complaint
    ({
      username: username,
      complainttype: complainttype,
      from:fr,
      to:to,
      reasonForComplain:roc,
      anythingElse:aos,
    });
    await complaint.save();
    res.sendFile(__dirname+"/final_complaint.html");
  });
  app.post("/userLeaveIn", async (req, res) => {
    const username = req.cookies.name;
    const fromDate = req.body.From;
    const toDate = req.body.To;
    const reasonForLeave = req.body.messag;
    const emergencyContactNumber = req.body.phone;
  
    console.log(fromDate,toDate,reasonForLeave,emergencyContactNumber);
    const leave = new leaveApplication
    ({
      username: username,
      fromDate: fromDate,
      toDate: toDate,
      reasonForLeave: reasonForLeave,
      emergencyContactNumber: emergencyContactNumber,
    });
    await leave.save();
    res.sendFile(__dirname+"/leave_application_form.html");
  });
  app.post("/userLateComingIn", async (req, res) => {
    const username = req.cookies.name;
    const reasonForLateComing = req.body.message;
    const currentLocation = req.body.link;
  
    console.log(reasonForLateComing,currentLocation);
    const lateComing = new LateComming
    ({
      username: username,
      reasonForLateComing: reasonForLateComing,
      currentLocation: currentLocation,
    });
    await lateComing.save();
    res.sendFile(__dirname+"/late_coming_form.html");
  });

  app.post("/usermesssuggestionIn", async (req, res) => {
    const username = req.cookies.name;
    const day = req.body.day;
    const meal = req.body.meal;
    const suggestions = req.body.reviews;
    console.log(day,meal,suggestions);
    const suggestionform = new suggestionForm
    ({
      username: username,
      day: day,
      meal: meal,
      suggestions: suggestions,
    });
    await suggestionform.save();
    res.sendFile(__dirname+"/suggestions_form.html");
  });

  app.get("/admin/complaints", async (req, res) => {
    try {
      const complaints = await Complaint.find();
      console.log(complaints); // Log the complaints for troubleshooting
      res.json(complaints); // Return complaints as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });
  app.get("/admin/leaveapplications", async (req, res) => {
    try {
      const leaveApplications = await leaveApplication.find();
      res.json(leaveApplications); // Return leave applications as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });


  app.get("/admin/latecoming", async (req, res) => {
    try {
      const lateComingApplications = await LateComming.find();
      res.json(lateComingApplications); // Return late coming applications as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });

  app.get("/admin/mess-suggestions", async (req, res) => {
    try {
      const suggestions = await suggestionForm.find();
      res.json(suggestions); // Return mess suggestions as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });
  app.post("/profilepage", async(req, res) => {
    const username = req.cookies.name;
    try {
      const person = await profile.findOne({emailID:username});
        res.render("profile",{name: person.name,
          emailID: person.emailID,
          phoneNo: person.phoneNo,
          section1: person.section1,
          section2: person.section2,
          section3: person.section3,
          ParentName: person.ParentName,
          ParentRelation: person.ParentRelation,
          ParentOccupation: person.ParentOccupation,
          ParentMobileNumber: person.ParentMobileNumber,
          ParentEmail: person.ParentEmail,
          Address: person.Address,
          HostelType: person.HostelType,
          RoomNumber: person.RoomNumber,
          RoomMateName: person.RoomMateName,
          RoomMateMobileNo: person.RoomMateMobileNo,
          RoomMateEmail: person.RoomMateEmail,
          HostelAddress: person.HostelAddress});
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  });

  app.post("/admin/leaveapplications", async(req, res) => {
      try {
        res.render("adminleave");
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }
  });
  app.post("/admin/complaints", async(req, res) => {
    try {
      res.render("admincomplaints");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
});
app.post("/admin/mess-suggestions", async(req, res) => {
  try {
    res.render("adminmesssuggestions");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

app.post("/admin/latecoming", async(req, res) => {
  try {
    res.render("adminlatecoming");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});  

app.post('/adminaddstudent', async (req, res) => {
  try {
    // Extract the form data from the request body
    const {
      name,
      emailID,
      phoneNo,
      section1,
      section2,
      section3,
      ParentName,
      ParentRelation,
      ParentOccupation,
      ParentMobileNumber,
      ParentEmail,
      Address,
      HostelType,
      RoomNumber,
      RoomMateName,
      RoomMateMobileNo,
      RoomMateEmail,
      HostelAddress,
      password,
    } = req.body;

    // Save the profile data to the database
    const Profile = new profile({
      name,
      emailID,
      phoneNo,
      section1,
      section2,
      section3,
      ParentName,
      ParentRelation,
      ParentOccupation,
      ParentMobileNumber,
      ParentEmail,
      Address,
      HostelType,
      RoomNumber,
      RoomMateName,
      RoomMateMobileNo,
      RoomMateEmail,
      HostelAddress,
    });
    await Profile.save();

    // Save the person data to the database
    const person = new Person({
      name: emailID, // Using emailID as the name field for Person model
      password,
    });
    await person.save();

    // Send a success response
    res.sendFile(__dirname+"/adminaddstudent.html");
  } catch (error) {
    // Handle any errors that occur during form submission
    console.error('Error submitting form:', error);
    res.status(500).send('An error occurred during form submission');
  }
});


app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
