"use strict";
const winston   = require("winston");
const validator = require("validator");

const USER = rootRequire("app_modules/internal").USER;

function register(req, res){

    const email     = req.body.email;
    const password  = req.body.password;

    //Validate for email and password
    if(validator.isEmail(email) && validator.isAlphanumeric(password) && password.length > 8){
        USER.checkIfAccountExist(email)
        .then(function(exist){
            if(exist){
                res.easy_conflict("email already exist");
            }else{
                //Valid emails must contain @ (which we have validated)
                const atIndex = email.indexOf("@");
                const name = email.substring(0, atIndex);
                //Put name as the first part before email

                USER.registerUser(name, email, password)
                .then(function(){
                    winston.info("registered new user: "+email);
                    res.easy_success({ email : email });
                })
                .catch(function(err){
                    winston.error("register error", err, req.body);
                    res.easy_error();
                });
            }
        });
    }else{
        res.easy_invalid();
    }
}

module.exports = register