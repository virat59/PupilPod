db = null;
var app = {
	
    initialize: function() {
		db = null;
        this.bindEvents();
    },
	
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
		var shortName = 'tnet_pupilpod';
		var version = '1.0';
		var displayName = 'Tnet_Pupilpod';
		var maxSize = 65535;
		db = window.openDatabase(shortName, version, displayName,maxSize);
		db.transaction(app.createTable,app.errorHandlerTransaction,app.successCallBack);
    },
	
	createTable: function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS tnet_login_details(Id INTEGER NOT NULL PRIMARY KEY, field_key TEXT NOT NULL, field_value TEXT NOT NULL)',[],app.nullHandler,app.errorHandlerQuery); 
	},
	
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	
    successHandler: function(result) {
		return false;
    },
	
    errorHandler: function(error) {
		alert("errorHandler Code : "+error.code+" Message "+error.message);
		return false;
    },
	errorHandlerTransaction: function(error){
		alert("errorHandlerTransaction Code : "+error.code+" Message "+error.message);
		return false;
	},
	errorHandlerQuery: function(error){
		alert("errorHandlerQuery Code : "+error.code+" Message "+error.message);
		return false;
	},
	successInsert: function(error){
		return false;
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
					db.transaction(function(transaction) {
						transaction.executeSql('INSERT INTO tnet_login_details(field_key, field_value) VALUES (?,?)',['reg_id', e.regid],app.successInsert,app.errorHandlerQuery);
					},app.errorHandlerTransaction,app.nullHandler);
					this.getDBValues('reg_id');
                }
                break;

            case 'message':
                alert('message = '+e.message);
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
		db.transaction(function(transaction) {
			transaction.executeSql('INSERT INTO tnet_login_details(field_key, field_value) VALUES (?,?)',[field_key, field_value],app.nullHandler,app.errorHandlerQuery);
		},app.errorHandlerTransaction,app.nullHandler);
		return false;
	},
	
	nullHandler: function(){
		return false;
	},
	
	successCallBack: function() {
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE field_key = ? ", ['reg_id'],function(transaction, result)
			{
				$('#lbUsers').html('');
				if (result != null && result.rows != null) {
					if(result.rows.length == 0){
						var pushNotification = window.plugins.pushNotification;
						pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"74320630987","ecb":"app.onNotificationGCM"});
					}
					else{
						for (var i = 0; i < result.rows.length; i++) {
							var row = result.rows.item(i);
							$('#lbUsers').append('<br>' + row.Id + '. ' +row.field_key+ ' ' + row.field_value);
						}
					}
				}
				else{
					var pushNotification = window.plugins.pushNotification;
					pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"74320630987","ecb":"app.onNotificationGCM"});
				}
				return false;
			},app.errorHandlerQuery);
		},app.errorHandlerTransaction,app.nullHandler);
		return false;
	},
	
	getDBValues: function(field_key) {
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE field_key = ? ", [field_key],function(transaction, result)
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
			},app.errorHandlerQuery);
		},app.errorHandlerTransaction,app.nullHandler);
		return false;
	}
};
