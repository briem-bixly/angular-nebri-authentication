(function(window, angular, undefined) {
    'use strict';
    angular.module('nebriAngularBasicAuth', []).
    provider('nebriAngularBasicAuth', function() {
        var username = null,
            password = null,
            me = this;
        this.setCredentials = function(user, pass){
            username = user;
            password = pass;
        };
        this.createNebriBasicAuthInstance = function($http){
            if(username == null || password == null){
                throw new Error('Please provide your username and password via setCredentials');
            }
            $http.defaults.headers.common.Authorization = 'Basic '+btoa(username+':'+password);
        };
        this.$get = ['nebriosAngular', '$http', function(nebriosAngular, $http) {
            me.createNebriBasicAuthInstance($http);
            return {
                api_request: function(api_module, view_name, method, payload){
                    return nebriosAngular.api_request(api_module, view_name, method, payload);
            	}
            };
        }];
    });
})(window, window.angular);