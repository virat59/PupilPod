/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.service('PPODService',function($http,url,$window,$timeout){    
	this.loginFunction = function ($scope){
		alert('Hi inside Service '+url);
        var param = JSON.stringify({
                "serviceName":"TnetMobileService", 
                "methodName":"login",
                "parameters":[null,{'instName' : $scope.instName,'userName' : $scope.userName,'password': $scope.password,'registration_key' : $scope.registration_key}]
                });
		//alert(param);
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
		$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
		$http.post(url, param)
		.success(function(data, status, headers, config) {	
			alert('Success');
		})
		.error(function(data, status, headers, config){
			alert('Fail data '+data);
			alert('Fail status '+status);
			alert('Fail headers '+headers);
			alert('Fail config '+config);
		});
		
		/* var req = {
			method: 'POST',
			url: 'http://thoughtnet.pupilpod.in/validateServer.php',
			headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			data: {  }
		}; */
		//'INSTITUTION_NAME' : $scope.instName,'USER_NAME' : $scope.userName,'PASSWORD': $scope.password,'registration_key' : $scope.registration_key
		/* $http(req).success(function(data, status, headers, config){
			alert('Success');
		})
		.error(function(data, status, headers, config){
			alert('Fail data '+data);
			alert('Fail status '+status);
			alert('Fail headers '+headers);
			alert('Fail config '+config);
		}); */
    };
});