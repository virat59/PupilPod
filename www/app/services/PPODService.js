/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.service('PPODService',function($http,url,$window,$timeout){    
	this.loginFunction = function ($scope){
		alert('Hi inside Service '+url);
        /* var param = JSON.stringify({
                "serviceName":"TnetMobileService", 
                "methodName":"login",
                "parameters":[null,{'instName' : $scope.instName,'userName' : $scope.userName,'password': $scope.password,'registration_key' : $scope.registration_key}]
                }); */
		//alert(param);
		$http.post('http://thoughtnet.pupilpod.in/validateServer.php', {'INSTITUTION_NAME' : $scope.instName,'USER_NAME' : $scope.userName,'PASSWORD': $scope.password,'registration_key' : $scope.registration_key}).success(function(data) {	
			alert('Success');
		}).error(function(data){
			alert('Fail');
		});
    };
});