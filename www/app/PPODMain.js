/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = angular.module('PPOD',['ngRoute','mobile-angular-ui','mobile-angular-ui.gestures']);

/*app.config(function($stateProvider, $urlRouterProvider,url) {
 $urlRouterProvider.otherwise('/index'); 
    $stateProvider
    .state('home', {
          url: '/home',
          templateUrl: 'app/views/Home.html'         
     })
	.state('main', {
        url: '/main',
        templateUrl: 'app/views/others/login.html',
		controller:'PPODController'
    })
	.state('index', {
        url: '/index',
        templateUrl: 'index.html',
		controller:'PPODController'
    });
});*/

app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'index.html', reloadOnSearch: false});
  $routeProvider.when('/home',        {templateUrl: 'Home.html', reloadOnSearch: false}); 
  $routeProvider.when('/login',        {templateUrl: 'login.html', reloadOnSearch: false}); 
});