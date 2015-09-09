(function(window, angular, undefined) {
    'use strict';
    angular.module('nebriAngularTokenAuth', []).
    provider('nebriAngularTokenAuth', function() {
        var token = null,
        me = this;
        this.setToken = function(tkn){
            token = tkn;
        };
        this.createNebriTokenAuthInstance = function(){
            if(token == null){
                throw new Error('Please provide your token via setToken');
            }
        };
        this.$get = ['nebriosAngular', '$q', function(nebriosAngular, $q) {
            me.createNebriTokenAuthInstance();
            return {
                api_request: function(api_module, view_name, method, payload){
                    var deferred = $q.defer();
                    if (payload == undefined || payload == null){
                        payload = {'token': token};
                    } else {
                        payload['token'] = token;
                    }
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