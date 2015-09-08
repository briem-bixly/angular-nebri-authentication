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
        this.$get = ['nebriosAngular', function(nebriosAngular) {
            me.createNebriTokenAuthInstance();
            return {
                api_request: function(api_module, view_name, method, payload){
                    if (payload == undefined || payload == null){
                        payload = {'token': token};
                    } else {
                        payload['token'] = token;
                    }
                    return nebriosAngular.api_request(api_module, view_name, method, payload);
            	}
            };
        }];
    });
})(window, window.angular);