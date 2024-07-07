const express= require('express');
const fileuploader=require("express-fileupload");
const app=express();
const port=process.env.PORT || 3077;
const mysql2=require('mysql2');
app.listen(port,function()
{
    console.log(`The server has started at port: ${port}`);
});

app.use(express.urlencoded({extended:true}));
app.use(fileuploader());

app.use(express.static("public"));
const congObj={
    host:"localhost",
    user:"root",
    password:"Yuvraj2004@",
    database:"serverMySql",
    dateStrings:true
}

const mysql=mysql2.createConnection(congObj);

mysql.connect(function(err)
{
    if(err) console.log("Not able to connect to the database");
    else console.log("Succesfully connected to the database");
})

app.get("/", function(req,resp)
{
    let filepath=process.cwd()+"/public/index.html";
    resp.sendFile(filepath);
})

app.get("/signup-save",function(req,resp)
{
    // create table users(emailID varchar(60) primary key, PWD varchar(20), UType varchar(10), Sstatus int, EntryDate date);
    const email=req.query.kuchEmail;
    const password=req.query.kuchPass;
    const type=req.query.kuchType;
    
    mysql.query("select * from users where emailID=? ",[email],function(err,resultJsonAry)
        {
            if(resultJsonAry.length==1)
                resp.send("Email already exists");
            else
            {
                mysql.query("insert into users values(?,?,?,1,current_date)",[email,password,type],function(err)
                {   
                    if(err==null)
                    { 

                        resp.send(type);
                    }
                    else
                    resp.send(err.message);
                })
            }
        })
    

})

app.get("/login-email",function(req,resp)
    {

    // create table users(emailID varchar(60) primary key, PWD varchar(20), UType varchar(10), Sstatus int, EntryDate date);
        mysql.query("select * from users where emailID=? and PWD=?",[req.query.kuchEmail,req.query.passKuch],function(err,resultJsonAry)
        {
            if(resultJsonAry.length==1)
            {
                if(resultJsonAry[0].Sstatus==1)
                {   
                    // let current=process.cwd()+"/public/Customer-dashboard.html";
                    // resp.sendFile(current);
                    resp.send(resultJsonAry[0].UType);
                }
                // else
                // resp.send(`U have been blocked, kindly contact the admin`);
            }
                
            else
                resp.send("Failed to Login");
        })
})

app.get("/Customer-dashboard", function(req,resp)
{
    let filepath=process.cwd()+"/public/Customer-dashboard.html";
    resp.sendFile(filepath);
})

app.get("/CustomerProfile",function(req,resp)
{
    let filepath=process.cwd()+"/public/customer-profile.html";
    resp.sendFile(filepath);
})

app.post("/customer-profile-save",function(req,resp)
{
    // create table customerprofile (emailID varchar(60) primary key, fname varchar(20), CNumber varchar(11), address varchar(100), city varchar(20), state varchar(20), picname varchar(20));
    const email=req.body.txtEmail;
    const Name=req.body.txtName;
    const Phone=req.body.txtNumber;
    const address=req.body.txtAddress;
    const city=req.body.txtCity;
    const state=req.body.txtState;
    let filename;
    if(req.files==null)
    filename="nopic.jpg";
    else
    {
        filename=req.files.ppic1.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.ppic1.mv(path);
    }

    req.body.ppic1=filename;
    mysql.query("select * from users where emailID=? ",[email],function(err,resultJsonAry)
        {
            if(resultJsonAry.length==0)
                resp.send("Email ID not registered !");
            else 
            {
                mysql.query("insert into customerprofile values(?,?,?,?,?,?,?)",[email,Name,Phone,address,city,state,filename],function(err)
                {   
                    if(err==null)
                    { 
                        resp.send("Profile saved successfully !");
                    }
                    else
                    resp.send(err.message);
                })
            }
        })
})

app.post("/customer-profile-update",function(req,resp)
{   
     // create table customerprofile (emailID varchar(60) primary key, fname varchar(20), CNumber varchar(11), address varchar(100), city varchar(20), state varchar(20), picname varchar(20));
     const email=req.body.txtEmail;
     const Name=req.body.txtName;
     const Phone=req.body.txtNumber;
     const address=req.body.txtAddress;
     const city=req.body.txtCity;
     const state=req.body.txtState;
     let filename;
    if(req.files==null)
    filename=req.body.hdn;
    else
    {
        filename=req.files.ppic1.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.ppic1.mv(path);
    }
    
    req.body.ppic1=filename;
    mysql.query("update customerprofile set fname=?,CNumber=?,address=?,city=?,state=?,picname=? where emailID=?",[Name,Phone,address,city,state,filename,email],function(err,resultJsonAry)
    {
        if(err==null)
        { 
            resp.send("Profile updated successfully !");
        }
        else {
            resp.send(err.message);
        }
     })
    
})
app.get("/customer-profile-search",function(req,resp)
{
    const email=req.query.kuchEmail;
    mysql.query("select * from customerprofile where emailID=?",[email],function(err,resultJsonAry)
    {
        if(resultJsonAry.length==1)
        {
            resp.send(resultJsonAry);
        }
    })

})

app.get("/change-password",function(req,resp)
{
    const email=req.query.kuchEmail;
    const OldPass=req.query.PwdOld;
    const NewPass=req.query.PwdNew;
    mysql.query("select * from users where emailID=? and PWD=?",[email,OldPass],function(err,resultJsonAry)
    {
        if(resultJsonAry.length==1)
        {
            mysql.query("update users set PWD=? where emailID=?",[NewPass,email],function(err,resultJsonAry)
            {
                if(err==null)
                resp.send("Password updated successfully !");
                else
                resp.send(err.message);

            })
        }
        else
        resp.send("Email ID or password is incorrect");
    })
})

app.get("/job-requirement",function(req,resp)
{
    // create table jobRequest(ReqID int primary key auto_increment, emailID varchar(60), Category varchar(20), address varchar(200), city varchar(20), TillDate date, Task varchar(200));

    const email=req.query.kuchEmail;
    const address=req.query.kuchAddress;
    const city=req.query.kuchCity;
    const WorkCategory=req.query.kuchCategory;
    const Duration=req.query.kuchDuration;
    const detailwork=req.query.kuchDetailwork;

    mysql.query("select * from customerprofile where emailID=?",[email],function(err,resultJsonAry)
    {
        if(resultJsonAry.length==1)
        {   
            mysql.query("insert into jobRequest(emailID,Category,address,city,TillDate,Task) values (?,?,?,?,?,?)",[email,WorkCategory,address,city,Duration,detailwork],function(err,resultJsonAry)
            {
                if(err==null)
                resp.send("Your Job request has been send !");
                else 
                resp.send(err.message);
            })

        }
        else
        resp.send("Email ID or password is incorrect");
    })
})

app.get("/home-wala-radio",function(req,resp){
    const email=req.query.kuchEmail;

    mysql.query("select * from customerprofile where emailID=?",[email],function(err,resultJsonAry)
    {
        if(resultJsonAry.length==1)
        {
            resp.send(resultJsonAry);
        }
    })
})

app.get("/Provider-dashboard",function(req,resp)
{
    let filename=process.cwd()+"/public/providerDashboard.html";
    resp.sendFile(filename);
})
app.get("/find-jobs-page",function(req,resp)
{
    let filename=process.cwd()+"/public/find-jobs.html";
    resp.sendFile(filename);
})
app

app.get("/provider-profile",function(req,resp)
{
    let filename=process.cwd()+"/public/provider-profile.html";
    resp.sendFile(filename);
})

app.post("/provider-profile-save",function(req,resp)
{
    // create table ProviderProfile (emailID varchar(60) primary key, fname varchar(20), CNumber varchar(11), gender varchar(10), category varchar(30), firm varchar(20), website varchar(30), location varchar(100), since int, proofPicName varchar(150), OtherInfo varchar(200));
    const email=req.body.txtEmail;
    const Name=req.body.txtName;
    const Phone=req.body.txtNumber;
    const gender=req.body.gender;
    const address=req.body.txtAddress;
    const since=req.body.txtSince;
    const firm=req.body.firm;
    const website=req.body.website;
    const category=req.body.txtCategory;
    const specialization=req.body.Specialization;

    let proof;
    proof = req.files.idPicChange.name;
    let pathproof = process.cwd()+"/Public/Uploads/"+proof;
    req.files.idPicChange.mv(pathproof);
    req.body.idPicChange = proof;
                
    mysql.query("insert into ProviderProfile values(?,?,?,?,?,?,?,?,?,?,?)",[email,Name,Phone,gender,category,firm,website,address,since,proof,specialization],function(err)
    {   
        if(err==null)
        { 
            resp.send("Profile saved successfully !");
        }
        else {
            resp.send(err.message);  
        }
        })
})

app.post("/provider-profile-update",function(req,resp)
{   
    // create table ProviderProfile (emailID varchar(60) primary key, fname varchar(20), CNumber varchar(11), gender varchar(10), category varchar(30), firm varchar(20), website varchar(30), location varchar(100), since int, proofPicName varchar(150), OtherInfo varchar(200));
    const email=req.body.txtEmail;
    const Name=req.body.txtName;
    const Phone=req.body.txtNumber;
    const gender=req.body.gender;
    const address=req.body.txtAddress;
    const since=req.body.txtSince;
    const firm=req.body.firm;
    const website=req.body.website;
    const category=req.body.txtCategory;
    const specialization=req.body.Specialization;

    if(req.files==null)
    proofname=req.body.proofhdn;
    else
    {
        proofname=req.files.idPicChange.name;
        let proofpath=process.cwd()+"/public/uploads/"+proofname;
        req.files.idPicChange.mv(proofpath);
    }
    
    req.body.idPicChange=proofname;
    
    mysql.query("update ProviderProfile set fname=?, CNumber=?, gender=?, category=?, firm=?, website=?, location=?, since=?, ProofPicName=?, OtherInfo=? where emailID=?",[Name,Phone,gender,category,firm,website,address,since,proofname,specialization,email],function(err,resultJsonAry)
    {
        if(err==null)
        { 
            resp.send("Profile updated successfully !");
        }
        else {
            resp.send(err.message);
        }
    })
})


app.get("/fetch-provider-details",function(req,resp){
    const email=req.query.kuchEmail;
    mysql.query("select * from ProviderProfile where emailID=?",[email],function(err,resultJsonAry)
    {
        if(resultJsonAry.length==1)
        {
            resp.send(resultJsonAry);
        }
    })
})

app.get("/admin-dashboard",function(req,resp)
{
    let filename=process.cwd()+"/public/Admin-dashboard.html";
    resp.sendFile(filename);
})

app.get("/user-manager",function(req,resp)
{
    let filename=process.cwd()+"/public/Users-manager.html";
    resp.sendFile(filename);
})

app.get("/fetch-users",function(req,resp)
{
    mysql.query("select * from users",function(err,resultJsonAry)
    {
        resp.send(resultJsonAry);
    })
})

app.get("/delete-user",function(req,resp)
{
    const email=req.query.emailkuch;
    mysql.query("delete from users where emailID=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("The user has been deleted");
        else
        resp.send("Invalid ID");
        }
        else
        resp.send(err.message);
    })
})

app.get("/block-user",function(req,resp)
{
    const email=req.query.emailkuch;
    mysql.query("update users set Sstatus=0 where emailID=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("The user has been blocked");
        else
        resp.send("Invalid ID");
        }
        else
        resp.send(err.message);
    })
})

app.get("/unblock-user",function(req,resp)
{
    const email=req.query.emailkuch;
    mysql.query("update users set Sstatus=1 where emailID=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("The user has been unblocked");
        else
        resp.send("Invalid ID");
        }
        else
        resp.send(err.message);
    })
})

app.get("/job-manager",function(req,resp)
{
    let filename=process.cwd()+"/public/job-manager.html";
    resp.sendFile(filename);
})

app.get("/search-service-providers",function(req,resp)
{
    let filename=process.cwd()+"/public/search-service-providers.html";
    resp.sendFile(filename);
})

app.get("/fetch-job-request",function(req,resp)
{
    const mail = req.query.fetchmail;
    mysql.query("select * from jobRequest where emailID=?",[mail],function(err,resultJsonAry) {
        if (err == null) {
            resp.send(resultJsonAry);    
        }

        else {
            resp.send(err.message);
        }        
    })
})

app.get("/delete-job-request",function(req,resp)
{
    const email=req.query.RIDkuch;
    mysql.query("delete from jobRequest where ReqID=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("The Job Request has been deleted");
        else
        resp.send("Invalid ID");
        }
        else
        resp.send(err.message);
    })
})

app.get("/fetch-distinct-city",function(req,resp)
{
    mysql.query("select distinct location from ProviderProfile",function(err,resultJsonAry)
    {
        if(err==null)
        {
            resp.send(resultJsonAry);
        }
        else
        {
            resp.send(err.message);
        }
    })
})

app.get("/fetch-one-record",function(req,resp)
{
    mysql.query("select * from ProviderProfile where location=? and category=?",[req.query.location,req.query.category],function(err,resultJsonAry)
    {
        resp.send(resultJsonAry);
    })
    
})

app.get("/fetch-distinct-category",function(req,resp)
{
    mysql.query("select distinct category from ProviderProfile",function(err,resultJsonAry)
    {
        if(err==null)
        {
            resp.send(resultJsonAry);
        }
        else
        {
            resp.send(err.message);
        }
    })
})

app.get("/admin-customer",function(req,resp)
{
    let filename=process.cwd()+"/public/admin-customer-manager.html";
    resp.sendFile(filename);
})

app.get("/admin-serviceProvider",function(req,resp)
{
    let filename=process.cwd()+"/Public/admin-serviceProvider-manager.html";
    resp.sendFile(filename);
})

app.get("/fetch-admin-customers",function(req,resp)
{
    mysql.query("select * from customerprofile",function(err,resultJsonAry)
    {
        resp.send(resultJsonAry);
    })
})

app.get("/fetch-admin-providers",function(req,resp)
{
    mysql.query("select * from ProviderProfile",function(err,resultJsonAry)
    {
        resp.send(resultJsonAry);
    })
})

app.get("/fetch-distinct-city-request",function(req,resp)
{
    mysql.query("select distinct city from jobRequest ",function(err,resultJsonAry)
    {
        if(err==null)
        {
            resp.send(resultJsonAry);
        }
        else
        {
            resp.send(err.message);
        }
    })
})

app.get("/fetch-distinct-category-request",function(req,resp)
{
    mysql.query("select distinct Category from jobRequest",function(err,resultJsonAry)
    {
        
        if(err==null)
        {
            resp.send(resultJsonAry);
        }
        else
        {
            resp.send(err.message);
        }
    })
})

app.get("/fetch-one-record-request",function(req,resp)
{
    mysql.query("select * from jobRequest where city=? and Category=?",[req.query.city,req.query.Category],function(err,resultJsonAry)
    {
        resp.send(resultJsonAry);
    })
    
})
