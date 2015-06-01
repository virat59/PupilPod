/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.service('PPODService',function($http,$window,$timeout){    
	this.loginFunction = function ($scope){      
        var param = JSON.stringify({
                "serviceName":"TnetMobileService", 
                "methodName":"login",
                "parameters":[null,{'instName' : $scope.instName,'userName' : $scope.userName,'password': $scope.password,'registration_key' : $scope.registration_key}]
                });
		var deferred = $q.defer();
			$http.post(url, param).success(function(data) {				
				alert('Success');
				//deferred.resolve(data);
			}).error(function(data){
				alert('Fail');
				//deferred.reject("We could not successfully connect with the server.Try after some time.");
			});
		return deferred.promise;                        
    };
});