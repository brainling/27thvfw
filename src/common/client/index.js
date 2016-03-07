'use strict';

require('./components/empty-sidebar');

require('./directives/alert-container');
require('./directives/loading-panel');
require('./directives/link-errors');
require('./directives/login-form');

require('./services/pilot-service');
require('./services/theater-service');
require('./services/alert-service');
require('./services/auth-service');

module.exports = {
    FetchServiceBase: require('./services/fetch-service-base')
};
