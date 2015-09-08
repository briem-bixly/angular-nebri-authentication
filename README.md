# Angular Nebri Authentication

The simple and easy-to-use package for making authenticated Nebri api requests from a Angular application.

This app is intended for use with a Nebri instance. Visit https://nebrios.com to sign up for free!

<h2>Installation</h2>
Copy any/all of the js files to the appropriate location in your application. The location(s) should be added to the index or base html page.
```
<script src="path/to/nebri-angular-token-auth.js"></script>
<script src="path/to/nebri-angular-basic-auth.js"></script>
<script src="path/to/nebri-angular-oauth.js"></script>
```

<h2>Requirements</h2>
This app requires the use of https://github.com/briem-bixly/angular-nebri.

<strong>NOTE</strong>: Before using any classes and associated functions in this package, you must include nebrios-authentication in your Nebri Instance and set up any authentication methods you would like to utilize. See https://github.com/briem-bixly/nebrios-authentication/blob/master/README.md for more information.

<h2>Setup</h2>
Depending on what authentication schema you would like to use, apps should be added to your dependencies.
In app.js, nebriAngularTokenAuth/nebriAngularBasicAuth/nebriAngularOAuth should be added to your dependencies. The config section should be updated as well to include your credentials.
```
angular.module('myApp', [
  ...,
  'nebriAngular',
  'nebriAngularTokenAuth',
  'nebriAngularOAuth',
  'nebriAngularBasicAuth'
]).
config([...,
        'nebriAngularProvider',
        'nebriAngularTokenAuthProvider',
        'nebriAngularOAuthProvider',
        'nebriAngularBasicAuthProvider',
        function(..., nebriAngularProvider, nebriAngularTokenAuthProvider, nebriAngularOAuthProvider, nebriAngularBasicAuthProvider) {
  nebriAngularProvider.setInstanceName('instance_name');
  nebriAngularTokenAuthProvider.setToken('token');
  nebriAngularOAuthProvider.setCredentials('consumer_key', 'consumer_secret');
  nebriAngularBasicAuthProvider.setCredentials('username', 'password');
}]);
```
- all credentials should be set up on your Nebri instance before using these methods. See https://github.com/briem-bixly/nebrios-authentication

<h2>Public Function</h2>
<strong>api_request</strong>
- api_module: the name of the api module stored on your Nebri instance
- view_name: the name of the target function contained in the given api module
- method: the desired HTTP request method
- payload: an object containing params and values, can be set to null

<h2>Usage Example</h2>
```
.controller('myController', function(..., nebriAngularTokenAuth, nebriAngularBasicAuth, nebriAngularOAuth){
    nebriAngularTokenAuth.api_request('nebrios_authentication', 'test_token', 'post')
        .success(function(data){
            console.log(data);
        }).error(function(err){
            console.log(err);
        });
    nebriAngularBasicAuth.api_request('nebrios_authentication', 'test_basic', 'post')
        .success(function(data){
            console.log(data);
        }).error(function(err){
            console.log(err);
        });
    var request = nebriAngularOAuth.api_request('nebrios_authentication', 'another_test', 'post');
    request.then(
        function(data){
            console.log(data);
        }, function(err){
            console.log(err);
        });
});
```
- nebriAngularOAuth utilizes promises instead of just $http in order to ensure no api calls are made before an access token has been properly set up. Any calls that are created before an access token has be generated and saved are queued and sent once the access token has been returned properly.
