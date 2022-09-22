const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//Static Folder
app.use(express.static("public"));

//Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Signup route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function (req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    
   //Consruct requeted data
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    
    //sent data to sever in string format
    const jsonData = JSON.stringify(data);
    
    // X -- replace with server number which is present at the end of the api key ex. ({API KEY}-us2 -- X=2//
    const url = "https://usX.api.mailchimp.com/3.0/lists/{Audience ID}";

    const options = {
        method: "POST",
        auth: "{Anykey}:{Mailchimp API Key}",
    }

    //sent requeted data to mailchimp server using https and check the data is successfully sent or not
    const request = https.request(url, options, function (response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });
    
    //write data on server in JSON string format
    request.write(jsonData);
    request.end();

});

//redirect the failure route to signup route
app.post("/failure", function(req, res){
    res.redirect("/");
})


//open this file on any port on deployment sever as well as port 3000
app.listen(process.env.PORT || 3000, function () {
    console.log("server running on ort 3000");
});
