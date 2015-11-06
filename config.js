var fs = require('fs');
var confidence = require('confidence');

var env = process.env.NODE_ENV;
var localConfig = {};
if(env !== 'production' && fs.existsSync('./config.local')) {
    localConfig = require('./config.local');
}

var store = new confidence.Store({
    db: {
        $filter: 'env',
        production: {
            mongo: {
                url: process.env.MONGO_URL
            },
            aws: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        },
        $default: {
            mongo: {
                url: localConfig.mongoUrl
            },
            aws: {
                accessKeyId: localConfig.awsAccessKeyId,
                secretAccessKey: localConfig.awsSecretAccessKey
            }
        }
    }
});

var criteria = {
    env: env
};

exports.get = function(key) {
    return store.get(key, criteria);
};
