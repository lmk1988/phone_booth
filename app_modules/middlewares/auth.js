"use strict";
const express   = require("express");
const router    = express.Router();
const oauth     = rootRequire("app_modules/components/oauth2");

function middlewareAttachSessionAccessToken(req, res, next){
    //This allows consistent API to handle both client and mobile app API
    if(req.session && req.session.access_token){
        const access_token = req.session.access_token;
        if(req.method == "POST" || req.method == "PUT" || req.method == "DELETE"){
            if(req.body && !req.body.access_token && !req.get("Authorization")){
                //Attach session access_token to header for oauth to verify
                var override = req.get
                req.get = function(header){
                    if(header == "Authorization"){
                        return "Bearer "+access_token;
                    }else{
                        return override(header);
                    }
                };
            }
        }else if(req.method == "GET"){
            if(req.query && !req.query.access_token){
                //Attach session access_token to query for oauth to verify
                req.query.access_token = access_token;
            }
        }
    }

    next();
}

router.use(middlewareAttachSessionAccessToken);
router.use(oauth.authorise());

module.exports = router;