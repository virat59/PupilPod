var app = angular.module('PPOD',['ngRoute','mobile-angular-ui','mobile-angular-ui.gestures','pushNotifications.ctrl',"ngCordova",'ngAnimate']);

app.constant('url', 'NBA/amfphp-2.1/Amfphp/?contentType=application/json');

app.run(function() {
    FastClick.attach(document.body);
});

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
	.when('/exam_details',{
		templateUrl: 'app/views/others/exam_details.html', 
		reloadOnSearch: false
	})
	.when('/fees',{
		templateUrl: 'app/views/others/fees.html', 
		reloadOnSearch: false
	})
	.when('/paymentCallBack',{
		templateUrl: 'app/views/others/paymentCallBack.html', 
		reloadOnSearch: false
	})
	.when('/view_test_details/:test_ins_guid', { 
		controller: 'TestDetailsForStudent', 
		templateUrl: 'app/views/others/view_test_details.html',
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
	var isLogin = false;
	var login_entity_guid = '';
	var app_id = '';
	var student_guid = '';
	var student_name = '';
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
		getUserGuid: function() {
			return login_entity_guid;
		},
		setUserGuid: function(entity_guid) {
			login_entity_guid = entity_guid;
		},
		getIsLogin: function() {
			return isLogin;
		},
		setIsLogin: function(login) {
			isLogin = login;
		},
		getAppId: function() {
			return app_id;
		},
		setAppId: function(appid) {
			app_id = appid;
		},
		getStudentSelectedGuid: function() {
			return student_guid;
		},
		setStudentSelectedGuid: function(stuGuid) {
			student_guid = stuGuid;
		},
		getStudentSelectedName: function() {
			return student_name;
		},
		setStudentSelectedName: function(stuName) {
			student_name = stuName;
		}
	};
});