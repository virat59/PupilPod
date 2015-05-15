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
var shortName = 'tnet_pupilpod';
var version = '1.0';
var displayName = 'Tnet_Pupilpod';
var maxSize = 65535;
var app = {
    // Application Constructor
    initialize: function() {
		alert('initialize');
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		alert('initialize');
        app.receivedEvent('deviceready');
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"74320630987","ecb":"app.onNotificationGCM"});
		
		//Database Changes
		if (!window.openDatabase) {
				// not all mobile devices support databases  if it does not, the following alert will display
				// indicating the device will not be albe to run this application
			alert('Databases are not supported in this browser.');
			return;
		}
			// this line tries to open the database base locally on the device
			// if it does not exist, it will create it and return a databasev object stored in variable db
		db = openDatabase(shortName, version, displayName,maxSize);
			// this line will try to create the table User in the database just created/openned
		db.transaction(function(tx){
				// you can uncomment this next line if you want the User table to be empty each time the application runs
				// tx.executeSql( 'DROP TABLE User',nullHandler,nullHandler);
				// this line actually creates the table User if it does not exist and sets up the three columns and their types
				// note the UserId column is an auto incrementing column which is useful if you want to pull back distinct rows
				// easily from the table.
			tx.executeSql( 'CREATE TABLE IF NOT EXISTS tnet_login_details(Id INTEGER NOT NULL PRIMARY KEY, key TEXT NOT NULL, value TEXT NOT NULL)',[],nullHandler,errorHandler); 
		},errorHandler,successCallBack);
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
        //alert('Callback Success! Result = '+result)
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
			// this is the section that actually inserts the values into the User table
		if(getDBValues('reg_id') == ''){
			db.transaction(function(transaction) {
				transaction.executeSql('INSERT INTO User(key, value) VALUES (?,?)',['reg_id', result],
				nullHandler,errorHandler);
			});
		}
    },
    errorHandler:function(error) {
        alert(error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
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
	AddValueToDB:function(key,value) {
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
			// this is the section that actually inserts the values into the User table
		db.transaction(function(transaction) {
			transaction.executeSql('INSERT INTO User(key, value) VALUES (?,?)',[key, value],nullHandler,errorHandler);
		});
			// this calls the function that will show what is in the User table in the database 
			//ListDBValues();
		return false;
	},
	nullHandler:function(){},
	successCallBack:function() {
		//alert("DEBUGGING: success");
	},
	getDBValues:function(key) {
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}

			// this line clears out any content in the #lbUsers element on the page so that the next few lines will show updated content and not just keep repeating lines
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE key = '".key."';", [],function(transaction, result)
			{
				$('#lbUsers').html('');
				if (result != null && result.rows != null) {
					/* for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						$('#lbUsers').append('<br>' + row.UserId + '. ' +row.FirstName+ ' ' + row.LastName);
					} */
					var row = result.rows.item(0);
					result = row.value;
					$('#lbUsers').append('<br>' + row.UserId + '. ' +row.key+ ' ' + row.value);
				}
				else{
					result = '';
				}
			},errorHandler);
		},errorHandler,nullHandler);
		return result;
	}
};
