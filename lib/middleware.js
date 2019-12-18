var proxyHeaders = ['HTTP_VIA','VIA','Proxy-Connection','HTTP_FORWARDED_FOR','X-Forwarded-FOR','HTTP_X_FORWARDED','HTTP_FORWARDED','HTTP_CLIENT_IP','HTTP_FORWARDED_FOR_IP','X-PROXY-ID','MT-PROXY-ID','X-TINYPROXY','X_FORWARDED_FOR','FORWARDED_FOR','X_FORWARDED','FORWARDED','CLIENT-IP','CLIENT_IP','PROXY-AGENT','HTTP_X_CLUSTER_CLIENT_IP','FORWARDED_FOR_IP','HTTP_PROXY_CONNECTION'];

const geoip = require('geoip-lite');

const Sequelize = require('sequelize');
var tableName = "NA";
var isDBPassed = false;
var trackLocation = false;

var sequelize;

module.exports = exports = function (options) {
    if(!options)
        return checkProxy;
    else {
        if(typeof options.dbHost != 'undefined' && options.dbHost != "" 
            && typeof options.dbName != 'undefined' && options.dbName != ""
            && typeof options.dbUser != 'undefined' && options.dbUser != ""
            && typeof options.dbPass != 'undefined' && options.dbPass != ""
            && typeof options.dbDialect != 'undefined' && options.dbDialect != "") {
             sequelize = new Sequelize(options.dbName, options.dbUser, options.dbPass, {
              host: options.dbHost,
              dialect: options.dbDialect,
              logging: false,
              define: {
                timestamps: false
              }
            });
            isDBPassed = true;
        }
        if(typeof options.tableName != 'undefined' && options.tableName != "") {
            tableName = options.tableName;
        }

        if(typeof options.trackLocation != 'undefined' && options.trackLocation != "") {
            trackLocation = options.trackLocation;
        }
        return checkProxy;
    }    
};

var blockMsg = "Proxy Thread Identified!";

var checkProxy = function (req, res, next) {
    var reqObj = req.headers;
    var i, headerValue, hostname;
    for(i=0; i<proxyHeaders.length; i++) {
        headerValue = reqObj[proxyHeaders[i]];
        if(typeof headerValue == 'undefined') {
            headerValue = reqObj[proxyHeaders[i].toLowerCase()];
        }
        
        if(typeof headerValue != 'undefined') {
            // If DB Settings are passed and valid, then log the attack in DB
            if(isDBPassed && tableName!="NA") {
                var replacements = {ip: req.headers.host, query: req.url, type:"Bad Bot!", ua: ua, created_at : new Date()};
                var params = "ip_address, query, type, user_agent, created_at";
                var bindings = ":ip, :query, :type, :ua, :created_at";

                if(trackLocation) {
                    const geoinfo = geoip.lookup(req.ip);
                    if(typeof geoinfo != "undefined" && geoinfo!=null) {
                        replacements.city = geoinfo.city;
                        replacements.country = geoinfo.country;
                        replacements.latitude = geoinfo.ll[0];
                        replacements.longitude = geoinfo.ll[1];
                        replacements.timezone = geoinfo.timezone;
                        params = params+", city, country, latitude, longitude, timezone";
                        bindings = bindings+", :city, :country, :latitude, :longitude, :timezone";
                    }
                } 

                sequelize.query(
                    "INSERT INTO "+tableName+" ("+params+") values ("+bindings+")",
                    { 
                        replacements: replacements,
                        type: sequelize.QueryTypes.INSERT 
                    }
                ).then(function (clientInsertId) {
                    //Do Something if you need to do in callback!
                });
            }
            
            hostname = reqObj.host;
            if(hostname.indexOf('api')==-1) {
                return res.status(403).send(blockMsg)
            } else {
                return res.status(403).send({data: blockMsg})
            }
        }
    }   
    return next();
};