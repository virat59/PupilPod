/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db;
var app = {
	
    // Application Constructor
    initialize: function() {
		db = null;
		alert('initialize');
        this.bindEvents();
    },
	
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		alert('onDeviceReady');
        app.receivedEvent('deviceready');
		
		//Database Changes
		if (!window.openDatabase) {
				// not all mobile devices support databases  if it does not, the following alert will display
				// indicating the device will not be albe to run this application
			alert('Databases are not supported in this browser.');
			return;
		}
			// this line tries to open the database base locally on the device
			// if it does not exist, it will create it and return a databasev object stored in variable db
		
		var shortName = 'tnet_pupilpod';
		var version = '1.0';
		var displayName = 'Tnet_Pupilpod';
		var maxSize = 65535;
		
		//alert('Db '+db+' shortName '+shortName+' version '+displayName+' maxSize '+maxSize);
		
		db = window.openDatabase(shortName, version, displayName,maxSize);
		
		//alert('Hi Before Transaction '+db);
		
		db.transaction(app.createTable,app.errorHandlerTransaction,app.successCallBack);
				
		alert('End onDeviceReady');
    },
	
	createTable: function(tx){
		//alert('Hi Inside createTable');	
		tx.executeSql('CREATE TABLE IF NOT EXISTS tnet_login_details(Id INTEGER NOT NULL PRIMARY KEY, field_key TEXT NOT NULL, field_value TEXT NOT NULL)',[],app.nullHandler,app.errorHandlerQuery); 
	},
	
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        alert('Callback Success! Result = '+result);
		return;
    },
	
    errorHandler: function(error) {
        //alert("Error : "+error);
		alert("errorHandler Code : "+error.code+" Message "+error.message);
		return;
    },
	errorHandlerTransaction: function(error){
		alert("errorHandlerTransaction Code : "+error.code+" Message "+error.message);
		return;
	},
	errorHandlerQuery: function(error){
		//alert("errorHandlerQuery : "+error);
		alert("errorHandlerQuery Code : "+error.code+" Message "+error.message);
		return;
	},
	successInsert: function(error){
		//alert("successInsert : "+error);
		//alert("successInsert Code : "+error.code+" Message "+error.message);
		return;
	},
	
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
					if (!window.openDatabase) {
						alert('Databases are not supported in this browser.');
						return;
					}
						// this is the section that actually inserts the values into the tnet_login_details table
					alert('Db '+db);
					db.transaction(function(transaction) {
						transaction.executeSql('INSERT INTO tnet_login_details(field_key, field_value) VALUES (?,?)',['reg_id', e.regid],
						app.successInsert,app.errorHandlerQuery);
					},app.errorHandlerTransaction,app.nullHandler);
					
					//app.receivedEvent('loadBody');
					this.getDBValues('reg_id');
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                alert('message = '+e.message+' msgcnt = '+e.msgcnt);
                break;

            case 'error':
                alert('GCM error = '+e.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    },
	AddValueToDB: function(field_key,field_value) {
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
			// this is the section that actually inserts the values into the tnet_login_details table
		db.transaction(function(transaction) {
			transaction.executeSql('INSERT INTO tnet_login_details(field_key, field_value) VALUES (?,?)',[field_key, field_value],app.nullHandler,app.errorHandlerQuery);
		},app.errorHandlerTransaction,app.nullHandler);
			// this calls the function that will show what is in the tnet_login_details table in the database 
			//ListDBValues();
		return false;
	},
	
	nullHandler: function(){
		//alert('Error: Null Reference');
		return false;
	},
	
	successCallBack: function() {
		alert("DEBUGGING: success successCallBack ");
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE field_key = 'reg_id';", [],function(transaction, result)
			{
				$('#lbUsers').html('');
				if (result != null && result.rows != null) {
					alert('Found');
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						$('#lbUsers').append('<br>' + row.Id + '. ' +row.field_key+ ' ' + row.field_value);
					}
				}
				else{
					alert('Result Null , Not Found');
					var pushNotification = window.plugins.pushNotification;
					pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"74320630987","ecb":"app.onNotificationGCM"});
				}
			},app.successInsert,app.errorHandlerQuery);
		},app.errorHandlerTransaction,app.nullHandler);
		alert('Hi At Last successCallBack');
		this.getDBValues('reg_id');
		return false;
	},
	
	getDBValues: function(field_key) {
		alert('Inside getDBValues '+field_key);
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}

			// this line clears out any content in the #lbUsers element on the page so that the next few lines will show updated content and not just keep repeating lines
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE field_key = '"+field_key+"';", [],function(transaction, result)
			{
				$('#lbUsers').html('');
				if (result != null && result.rows != null) {
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						$('#lbUsers').append('<br>' + row.Id + '. ' +row.field_key+ ' ' + row.field_value);
					}
					var row = result.rows.item(0);
					resultForRet = row.field_value;
				}
				else{
					resultForRet = '';
				}
			},app.successInsert,app.errorHandlerQuery);
		},app.errorHandlerTransaction,app.nullHandler);
		return resultForRet;
	}
};
