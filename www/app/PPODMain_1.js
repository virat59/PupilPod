/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = angular.module('PPOD',['ngRoute','ui.bootstrap','ui.router','mobile-angular-ui']);

//app.constant('url', '/NBA/amfphp-2.1/Amfphp/?contentType=application/json');

app.config(function($stateProvider, $urlRouterProvider,url) {
 $urlRouterProvider.otherwise('/index'); 
    $stateProvider
    .state('home', {
          url: '/home',
          templateUrl: 'app/views/Home.html'         
     })
	.state('main', {
        url: '/main',
        templateUrl: 'app/views/others/login.html',
		controller:'DisplayController'
    })
	.state('index', {
        url: '/index',
        templateUrl: 'index.html',
		controller:'DisplayController'
    })
});
