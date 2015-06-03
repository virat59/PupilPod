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
	var parOrStu = '';
	var login_entity_guid = '';
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
		},
		getParOrStu: function() {
			return parOrStu;
		},
		setParOrStu: function(typeoflogin) {
			parOrStu = typeoflogin;
		},
		getLoginEntityGuid: function() {
			return login_entity_guid;
		},
		setLoginEntityGuid: function(entity_guid) {
			login_entity_guid = entity_guid;
		}
	};
});