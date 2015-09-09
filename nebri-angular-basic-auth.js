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
        this.$get = ['nebriosAngular', '$http', '$q', function(nebriosAngular, $http, $q) {
            me.createNebriBasicAuthInstance($http);
            return {
                api_request: function(api_module, view_name, method, payload){
                    var deferred = $q.defer();
                    nebriosAngular.api_request(api_module, view_name, method, payload)
                        .success(function(data){
                            deferred.resolve(data);
                        }).error(function(msg, code){
                            deferred.reject(msg);
                        });
                    return deferred.promise;
            	}
            };
        }];
    });
})(window, window.angular);