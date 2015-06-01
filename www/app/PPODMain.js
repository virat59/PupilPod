/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = angular.module('PPOD',['ngRoute','mobile-angular-ui','mobile-angular-ui.gestures','pushNotifications.ctrl',"ngCordova"]);

app.constant('url', 'http://thoughtnet.pupilpod.in/PupilPodMobile/amfphp-2.1/Amfphp/?contentType=application/json');

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
	.otherwise({redirectTo: 'app/views/Home.html' });
});

app.service('sharedProperties', function () {
  var list_name = '';

  return {
      getListName: function() {
          return list_name;
      },
      setListName: function(name) {
        list_name = name;
      }
  };
})