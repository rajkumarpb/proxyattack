var proxyHeaders = ['HTTP_VIA','VIA','Proxy-Connection','HTTP_FORWARDED_FOR','HTTP_X_FORWARDED','HTTP_FORWARDED','HTTP_CLIENT_IP','HTTP_FORWARDED_FOR_IP','X-PROXY-ID','MT-PROXY-ID','X-TINYPROXY','X_FORWARDED_FOR','FORWARDED_FOR','X_FORWARDED','FORWARDED','CLIENT-IP','CLIENT_IP','PROXY-AGENT','HTTP_X_CLUSTER_CLIENT_IP','FORWARDED_FOR_IP','HTTP_PROXY_CONNECTION'];

module.exports = exports = function (options) {
    return checkProxy;
};

var blockMsg = "Proxy Thread Identified!";

var checkProxy = function (req, res, next) {
    var i, headerValue, hostname;
    for(i=0; i<proxyHeaders.length; i++) {
        headerValue = req.headers[proxyHeaders[i]];
        if(typeof headerValue != 'undefined') {
            hostname = req.headers.host;
            if(hostname.indexOf('api')==-1) {
                res.status(403).send(blockMsg)
            } else {
                res.status(403).send({data: blockMsg})
            }
        }
    }    
    return next();
};
