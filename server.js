var express = require('express');
var bodyParser = require('body-parser');
var port=2000;
var connection = require('./database/database').connection;
var router=express.Router();
var app = express();
var df=require('dateformat');
var _=require('lodash');
var config  = require('./config');
var    jwt     = require('jsonwebtoken');

var path=require('path');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.all('*', function(req, res,next) {


    /**
     * Response settings
     * @type {Object}
     */
    var responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }


});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.static(path.join(__dirname, 'public')));
//--------------------------------------------
router.get('/values',function(req,res){
  
 connection.query('select * from slot limit 7',function(err,data){
  if(err)
    console.log(err);
  res.json({"values":data});  
 
});
});
//-----------------------------------------------------
router.post('/slotforday',function(req,res){
    var BookingDate=req.body.BookingDate;
var date=new Date(BookingDate);
var temp=date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
connection.query('select slot from slot where event_data= "'+temp+'"',function(err,rows,fields){
res.json({"slot":rows[0]});
});
});

//---------------------------------------------------
function Datecheck(BookingDate, done) {
connection.query('select event_data from slot where event_data= "'+BookingDate+'"',function(err,rows,fields){
    if (err) throw err;
   console.log(rows[0]);    done(rows[0]);
  });
}
router.post('/vendor/Newbook',function(req,res){
  var BookingDate=req.body.BookingDate;
  var  StartingTime=req.body.StartingTime;
  var  EndingTime=req.body.EndingTime;
  var  GroundStart=req.body.GroundStart;
  var  GroundEnd=req.body.GroundEnd;
  var SlotSize=req.body.SlotSize;
var date =BookingDate;
var newdate = date.split("/").reverse().join("-");
BookingDate=newdate;
//console.log("Date:>>"+newdate);
                          var date=new Date(BookingDate);
                          var temp=date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
                          console.log(temp);

                          var d = new Date(BookingDate);
                              var weekday = new Array(7);
                              weekday[0] = "Sunday";
                              weekday[1] = "Monday";
                              weekday[2] = "Tuesday";
                              weekday[3] = "Wednesday";
                              weekday[4] = "Thursday";
                              weekday[5] = "Friday";
                              weekday[6] = "Saturday";

                              var n = weekday[d.getDay()];
                              console.log(n);

//function for converting the string type to date format.



Datecheck(temp,function(checkDate){
  if(!checkDate) 
     {
                                    if(SlotSize==1.00){
                                                        var Str_Array=[24];
                                                        for(var i=0;i<24;i++){
                                                          if(GroundStart<=StartingTime && EndingTime<=GroundEnd){

                                                                      if(i==StartingTime && i<EndingTime){
                                                                        if(Str_Array[EndingTime]!=1){
                                                                      Str_Array[i]=1;}
                                                                      else{
                                                                        res.json({"message":"already booked"});
                                                                      }
                                                                    }
                                                                    else
                                                                    {
                                                                      Str_Array[i]=0;

                                                                    }
                                                      }
                                                      else{
                                                        res.send({"message":"the ground is not open in this time"});
                                                      }
                                                    }
                                                        var str3=Str_Array.map(String);
                                                      


                                                        var x={
                                                          event_data:temp,
                                                          day:n,
                                                          slot:str3
                                                        };        
                                                        connection.query("INSERT INTO slot (`event_data`, `day`, `slot`) VALUES ('" + x.event_data + "', '" + x.day + "', '" + x.slot + "')", function(err){
                                                          if(err)console.log(err);
                                                          else
                                                            res.json({"message":"succesfully inserted"});
                                                        });

                                               }
                                else if(SlotSize==0.50)
                                {
                                 var Str_Array=[48];
                                
                                         for(var i=0;i<48;i++){
                                          if(GroundStart<=StartingTime && EndingTime<=GroundEnd){
                                                        if(i==StartingTime && i<EndingTime){
                                                                                if(Str_Array[EndingTime]==0){
                                                                                                Str_Array[i]=1;
                                                                                                           }
                                                                               else{
                                                                              res.json({"message":"already booked"});
                                                                                  }
                                                                          }
                                                           else if(i<StartingTime && i+1>=StartingTime && i<EndingTime){
                                                                 if(Str_Array[i+1]!=1){
                                                                                      Str_Array[i+1]=1;
                                                                                                 }
                                                                     else{
                                                                    res.json({"message":"already booked"});
                                                                        }
                                                     }   
                                                            else
                                                  {
                                                    Str_Array[i]=0;

                                                  }
                                                  
                                                     }
                                        else{
                                          res.send({"message":"the ground is not open in this time"});
                                        }
                                      }
                                                        var str3=Str_Array.map(String);
                                                      


                                                        var x={
                                                          event_data:temp,
                                                          day:n,
                                                          slot:str3
                                                        
                                                        }; 
                                                        connection.query("INSERT INTO slottable (`event_data`, `slotsize`) VALUES ('" + x.event_data + "', '" + x.slotsize + "')", function(err){
                                                          if(err)console.log(err);
                                                                                                            });       
                                                        connection.query("INSERT INTO slot (`event_data`, `day`, `slot`) VALUES ('" + x.event_data + "', '" + x.day + "', '" + x.slot + "')", function(err){
                                                          if(err)console.log(err);
                                                          else
                                                            res.json({"message":"succesfully inserted"});
                                                        });


                                              }
                                     else{
                                      res.send({"message":"wrong slot size"});
                                     }
 }
 else{
        
    connection.query('select slot from slot where event_data= "'+temp+'"',function(err,rows,fields){
      
         if(SlotSize==1.00){
          console.log(rows[0]);
                               var str1=rows[0].slot;
                               console.log(str1);
                                var Num_Array=str1.split(",").map(Number);//converting to number array.
                                if(GroundStart<=StartingTime && EndingTime<=GroundEnd){
                                for(var i=StartingTime;i<=EndingTime;i++){//puting block for the specified time
                                   
                                          if(Num_Array[i]==0){
                                            Num_Array[i]=1;
                                          }
                                          else{
                                            res.json({"message":"already booked"});
                                          }
                                }}
                                else{
                                  res.send({"message":"the ground is not open in this time"});
                                }
                              
                                var str2=Num_Array.map(String);//again convert number to string for database entry.
                                var x={
                                  slot:str2
                                };

                                connection.query('UPDATE slot SET slot = "' + x.slot + '" where event_data="'+temp +'"',function(err){//update the table
                      if(err) console.log(err);
                      else
                        res.json({"message":"succesfully blocked"});
                    });
                  }
                    //if the slot size if 1/2 hours.
              else if(SlotSize==0.50){
                console.log(rows[0]);
                           var Str_Array=[48];
                            var str1=rows[0].slot;
                                var Str_Array=str1.split(",").map(Number);
                         for(var i=0;i<48;i++){
                          if(GroundStart<=StartingTime && EndingTime<=GroundEnd){
                                  if(i==StartingTime && i<EndingTime){
                                      if(Str_Array[EndingTime]==0){
                                                      Str_Array[i]=1;
                                                                 }
                                     else{
                                    res.json({"message":"already booked"});
                                        }
                                }
                                 else if(i<StartingTime && i+1>=StartingTime && i<EndingTime){
                                 if(Str_Array[i+1]!=1){
                                                      Str_Array[i+1]=1;
                                                                 }
                                     else{
                                    res.json({"message":"already booked"});
                                        }
                                }
                                else
                                {
                                  Str_Array[i]=0;
                                }
                                var str2=Str_Array.map(String);//again convert number to string for database entry.
                                var x={
                                  slot:str2
                                };
                          }
                      else{
                                res.send({"message":"the ground is not open in this time"});
                              }
                    }

                    connection.query('UPDATE slot SET slot = "' + x.slot + '" where event_data="'+temp +'"',function(err){//update the table
                    if(err) console.log(err);
                    else
                      res.json({"message":"succesfully blocked"});
                  });
          }
      else{
        res.send({"message":"the slotsize is not available"});
      }
      }); 
      }

  
});
});
//vendor register functionalities

//--------------------------------------------------------------------
router.post('/vendor/register', function(req, res) {
  var email=req.body.email;
  var password=req.body.password;
  console.log(password);
  connection.query("INSERT INTO login (`email`, `password`) VALUES ('" + email + "', '" + password + "')", function(err){
      if(err){
        res.send({"message":"Already registered","status":"False"});
        console.log(err);
      }
      else
      {
        res.send({"message":"registered succesfully","status":"True"});
      }


      /*token=createToken(vendor);
      res.json({"token":token,"success":"true"});
    connection.query('UPDATE login SET token = "' + token + '" where email="'+req.body.email +'"', function(err){
      if(err) console.log(err);
    });*/
  });
});




//--------------------------------------------------------------------------------------



//vendor login module.................

var secretKey = "this is the secretKey";
function createToken(vendor) {
  return jwt.sign(_.omit(vendor, 'password'), config.secretKey, { expiresIn: 60*60*5 });
}

function getUserDB(email, done) {
 connection.query('SELECT * FROM login WHERE email = ? LIMIT 1', [email], function(err, rows, fields) {
    if (err) throw err;
    done(rows[0]);
  });
}
//----------------------------------------------------------------------------
router.post('/vendor/login', function(req, res) {
  var email=req.body.email;
  console.log(email);
  getUserDB(req.body.email, function(vendor){
    if (!vendor) {
      return res.send({"message":"The email is not existing"});
    }
    else if (vendor.password != req.body.password) {
      return res.send({"message":"Incorrect Password"});
    }
    else
    {
      res.send({"message":"Login success"});
    }
      /*token=createToken(vendor);
      res.json({"token":token,"success":"true"});
    connection.query('UPDATE login SET token = "' + token + '" where email="'+req.body.email +'"', function(err){
      if(err) console.log(err);
    });*/
  });
});
//-----------------------------------------------------------
//vendor token checking module;
router.get('/vendor/check/:token', function(req, res) {
  if (!req.params.token) {
    return res.status(400).send("You must send a token");
  }
  getUserDB(req.params.token, function(vendor){
    if(!vendor) res.status(201).send({token: "OK","success":"true"});
    else res.status(400).send("A vendor with that token already exists");
  });
});

//------------------------------------------------------
//get the date from the vendor
router.get('/vendor',function(req,res){
  res.render('a');
});
router.post('/vendor/slot', function(req,res){
  var date=req.body.n1;
connection.query('SELECT dob FROM c WHERE dob = ?', date,function(err,data){

});
console.log(x);
});
app.use('/', router);
console.log("server running on"+port);
app.listen(port);
module.exports=app;
