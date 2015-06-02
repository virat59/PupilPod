/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = angular.module('PPOD',['ngRoute','mobile-angular-ui','mobile-angular-ui.gestures','pushNotifications.ctrl',"ngCordova"]);

app.constant('url', 'http://thoughtnet.pupilpod.in/NBA/amfphp-2.1/Amfphp/?contentType=application/json');

app.config(function($routeProvider) {
  $routeProvider
	.when('/',{
		templateUrl: 'app/views/Home.html', 
		reloadOnSearch: false
	})
	.when('/home',{
		templateUrl: 'app/views/Home.html', 
		reloadOnSearch: false
	})
	.when('/login',{
		templateUrl: 'app/views/others/login.html', 
		reloadOnSearch: false
	})
	.when('/sidebar',{
		templateUrl: 'app/views/others/sidebar.html', 
		reloadOnSearch: false
	})
	.when('/sidebarRight',{
		templateUrl: 'app/views/others/sidebarRight.html', 
		reloadOnSearch: false
	})
	.when('/mainLanding',{
		templateUrl: 'app/views/others/mainLanding.html', 
		reloadOnSearch: false
	})
	.otherwise({redirectTo: 'app/views/Home.html' });
});

app.service('sharedProperties', function () {
	var reg_key = '';
	var userName = '';
	var passWord = '';
	var instName = '';
	return {
		getRegKey: function() {
			return reg_key;
		},
		setRegKey: function(regKey) {
			reg_key = regKey;
		},
		getUserName: function() {
			return userName;
		},
		setUserName: function(user) {
			userName = user;
		},
		getPassWord: function() {
			return passWord;
		},
		setPassWord: function(pass) {
			passWord = pass;
		},
		getInstName: function() {
			return instName;
		},
		setInstName: function(inst) {
			instName = inst;
		}
	};
});