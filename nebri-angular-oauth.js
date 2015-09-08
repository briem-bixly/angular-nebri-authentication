(function(window, angular, undefined) {
    'use strict';
    angular.module('nebriAngularOAuth', []).
    provider('nebriAngularOAuth', function() {
        var token = null,
            consumer_key = null,
            consumer_secret = null,
            me = this,
            queued_requests = [];
        this.setCredentials = function(key, secret, tkn){
            consumer_key = key;
            consumer_secret = secret;
            token = tkn;
        };
        this.createNebriOAuthInstance = function(nebriosAngular){
            if(consumer_key == null || consumer_secret == null){
                throw new Error('Please provide your consumer key and consumer secret via setCredentials');
            }
            if (token == null){
                var payload = {'key': consumer_key, 'secret': consumer_secret};
                nebriosAngular.api_request("nebrios_authentication", "get_oauth_token", "post", payload)
                    .success(function(data){
                        token = data['access_token'];
                        if (queued_requests.length > 0){
                            var request = null;
                            for (var i = 0; i < queued_requests.length; i++){
                                request = queued_requests[i];
                                if (request['payload'] == undefined || request['payload'] == null){
                                    request['payload'] = {'access_token': token};
                                } else {
                                    request['payload']['access_token'] = token;
                                }
                                if (request['complete'] == false){
                                    me.deferred_request(nebriosAngular, request);
                                }
                            }
                            queued_requests = [];
                        }
                    }).error(function(err){
                        console.log(err);
                    });
            }
        };
        this.deferred_request = function(nebriosAngular, request){
            nebriosAngular.api_request(request['api_module'], request['view_name'], request['method'], request['payload'])
                .success(function(data){
                    request['complete'] = true;
                    request['promise'].resolve(data);
                }).error(function(msg, code){
                    request['complete'] = true;
                    request['promise'].reject(msg);
                });
        };
        this.$get = ['nebriosAngular', '$q', function(nebriosAngular, $q) {
            me.createNebriOAuthInstance(nebriosAngular);
            return {
                api_request: function(api_module, view_name, method, payload){
                    var deferred = $q.defer();
                    if (token == undefined){
                        queued_requests.push({
                            'api_module': api_module,
                            'view_name': view_name,
                            'method': method,
                            'payload': payload,
                            'promise': deferred,
                            'complete': false
                        });
                    } else {
                        if (payload == undefined || payload == null){
                            payload = {'access_token': token};
                        } else {
                            payload['access_token'] = token;
                        }
                        nebriosAngular.api_request(api_module, view_name, method, payload)
                            .success(function(data){
                                deferred.resolve(data);
                            }).error(function(msg, code){
                                deferred.reject(msg);
                            });
                    }
                    return deferred.promise;
            	}
            };
        }];
    });
})(window, window.angular);