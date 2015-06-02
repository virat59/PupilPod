/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.service('PPODService',function($http,url,$window,$timeout,sharedProperties,$cordovaPush,$rootScope){    
	this.dbConnection = function($scope,sharedProperties){
		var shortName = 'tnet_pupilpod';
		var version = '1.0';
		var displayName = 'Tnet_Pupilpod';
		var maxSize = 65535;
		db = $window.openDatabase(shortName, version, displayName,maxSize);
		db.transaction(createTable,errorHandlerTransaction,successCallBack);
		$scope.db = db;
	};
	
	function createTable(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS tnet_login_details(Id INTEGER NOT NULL PRIMARY KEY, field_key TEXT NOT NULL, field_value TEXT NOT NULL)',[],nullHandler,errorHandlerQuery); 
	};
	
    function successHandler(result) {
		return false;
    };
	
    function errorHandler(error) {
		alert("errorHandler Code : "+error.code+" Message "+error.message);
		return false;
    };
	
	function errorHandlerTransaction(error){
		alert("errorHandlerTransaction Code : "+error.code+" Message "+error.message);
		return false;
	};
	
	function errorHandlerQuery(error){
		alert("errorHandlerQuery Code : "+error.code+" Message "+error.message);
		return false;
	};
	
	function successInsert(error){
		//login
		//$window.location.href = '#/login';
		//alert('Value Inserted');
		return false;
	};
	
	this.AddValueToDB = function($scope,field_key,field_value) { //
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
		if(field_key == 'reg_id')
			sharedProperties.setRegKey(field_value);
		$scope.db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE field_key = ? ", ['reg_id'],function(transaction, result)
			{
				if (result != null && result.rows != null) {
					if(result.rows.length == 0){
						transaction.executeSql('INSERT INTO tnet_login_details(field_key, field_value) VALUES (?,?)',[field_key, field_value],nullHandler,errorHandlerQuery);
						alert('Inserted');
					}
					else{
						transaction.executeSql('UPDATE tnet_login_details set field_value = ? WHERE field_key = ? ',[field_key, field_value],nullHandler,errorHandlerQuery);
						alert('Updated');
					}
				}
			},errorHandlerQuery);
		},errorHandlerTransaction,nullHandler);
				
		return false;
	};
	
	function nullHandler(){
		return false;
	};
	
	function successCallBack() { //mySharedService
		alert('successCallBack');
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE field_key = ? ", ['reg_id'],function(transaction, result)
			{
				var androidConfig = {
					"senderID": "74320630987",
				};
				if (result != null && result.rows != null) {
					if(result.rows.length == 0){
						alert('Entry Not Exist 11');
						$cordovaPush.register(androidConfig).then(function(resultPush) {
						}, function(err) {
							alert('Error '+err);
						})
					}
					else{
						alert('Entry Exist');
						for (var i = 0; i < result.rows.length; i++) {
							var row = result.rows.item(i);
							if(row.field_key == 'reg_id'){
								sharedProperties.setRegKey(row.field_value);
							}
							else if(row.field_key == 'username'){
								sharedProperties.setUserName(row.field_value);
							}
							else if(row.field_key == 'password'){
								sharedProperties.setPassWord(row.field_value);
							}
						}
						$window.location.href = '#/login';
					}
				}
				else{
					//alert('Entry Not Exist 22');
					$cordovaPush.register(androidConfig).then(function(resultPush) {
					}, function(err) {
						// Error
						alert('Error '+err);
					})
				}
				return false;
			},errorHandlerQuery);
		},errorHandlerTransaction,nullHandler);
		return false;
	};
	
	this.loginFunction = function ($scope){
		var param = JSON.stringify({
                "serviceName":"TnetMobileService", 
                "methodName":"login",
                "parameters":[null,{'instName' : $scope.instName,'userName' : $scope.userName,'password': $scope.password,'registration_key' : $scope.registration_key}]
                });
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
		$http.post(url, param).success(function(data, status, headers, config) {	
			alert('Success Data '+data.valid);
			sharedProperties.setInstName($scope.instName);
			sharedProperties.setUserName($scope.userName);
			sharedProperties.setPassWord($scope.password);
			if(data.valid == 'VALID')
				$window.location.href = '#/mainLanding';
			else
				$scope.instDis = false;
		})
		.error(function(data, status, headers, config){
			alert('Fail data '+data);
			alert('Fail status '+status);
			alert('Fail headers '+headers);
			alert('Fail config '+config);
			return false;
		});
    };
	
	this.validateLogin = function($scope,sharedProperties){
		var param = JSON.stringify({
                "serviceName":"TnetMobileService", 
                "methodName":"loginValidate",
                "parameters":[null,{'instName' : $scope.instName,'userName' : $scope.userName,'password': $scope.password,'registration_key' : $scope.registration_key}]
                });
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
		$http.post(url, param).success(function(data, status, headers, config) {	
			alert('Success Data '+data.valid);
			sharedProperties.setInstName($scope.instName);
			sharedProperties.setUserName($scope.userName);
			sharedProperties.setPassWord($scope.password);
			if(data.valid == 'VALID')
				$window.location.href = '#/mainLanding';
			else
				$scope.instDis = false;
		})
		.error(function(data, status, headers, config){
			alert('Fail data '+data);
			alert('Fail status '+status);
			alert('Fail headers '+headers);
			alert('Fail config '+config);
			return false;
		});
	};
});