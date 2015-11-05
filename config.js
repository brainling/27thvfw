var confidence = require('confidence');

var env = process.env.NODE_ENV;
var localConfig = {};
if(env !== 'production') {
    localConfig = require('./config.local');
}

var store = new confidence.Store({
    db: {
        $filter: 'env',
        production: {
            mongo: {
                url: process.env.MONGO_URL
            }
        },
        $default: {
            mongo: {
                url: localConfig.mongoUrl
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
