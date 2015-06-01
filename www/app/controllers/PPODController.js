app.controller('PPODController',function($scope,PPODService,$http,$window,$document,$rootScope,$cordovaPush,$cordovaSQLite){    //
	$scope.contactname = "ThoughtNet Technologies (India) Pvt. Ltd";
	initialize();
	function initialize() {
		//alert('Hi In initialize');
		$scope.db = null;
        bindEvents();
    };
	
	var androidConfig = {
		"senderID": "74320630987",
	};
	
	function bindEvents() {
		//alert('Hi In BindEvents');
        document.addEventListener('deviceready', onDeviceReady, false);
    };
	
	
	function onDeviceReady() {
		//alert('Alert onDeviceReady');
		receivedEvent('deviceready');
		var shortName = 'tnet_pupilpod';
		var version = '1.0';
		var displayName = 'Tnet_Pupilpod';
		var maxSize = 65535;
		db = $window.openDatabase(shortName, version, displayName,maxSize);
		db.transaction(createTable,errorHandlerTransaction,successCallBack);
    };
	
	function receivedEvent(id) {
		//alert('Event Received '+id);
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    };
	
	function createTable(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS tnet_login_details(Id INTEGER NOT NULL PRIMARY KEY, field_key TEXT NOT NULL, field_value TEXT NOT NULL)',[],nullHandler,errorHandlerQuery); 
	};
	
    function receivedEvent(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    };
	
    function successHandler(result) {
		//alert('successHandler '+result);
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
	
	$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            //alert('registration ID = ' + notification.regid);
			//alert('Hii Came');
			AddValueToDB('reg_id',notification.regid);
			$window.location.href = '#/login';
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });
	
	
	
    function AddValueToDB(field_key,field_value,sharedService) {
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
		db.transaction(function(transaction) {
			transaction.executeSql('INSERT INTO tnet_login_details(field_key, field_value) VALUES (?,?)',[field_key, field_value],nullHandler,errorHandlerQuery);
		},errorHandlerTransaction,nullHandler);
		sharedService.setRegKey(field_value);
		return false;
	};
	
	function nullHandler(){
		return false;
	};
	
	function successCallBack() {
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE field_key = ? ", ['reg_id'],function(transaction, result)
			{
				$('#lbUsers').html('');
				if (result != null && result.rows != null) {
					if(result.rows.length == 0){
						//alert('Entry Not Exist 11');
							$cordovaPush.register(androidConfig).then(function(resultPush) {
							// Success
							//alert('Success '+resultPush);
						}, function(err) {
							// Error
							alert('Error '+err);
						})
					}
					else{
						//alert('Entry Exist');
						for (var i = 0; i < result.rows.length; i++) {
							var row = result.rows.item(i);
							$('#lbUsers').append('<br>' + row.Id + '. ' +row.field_key+ ' ' + row.field_value);
						}
						$window.location.href = '#/login';
					}
				}
				else{
					//alert('Entry Not Exist 22');
					$cordovaPush.register(androidConfig).then(function(resultPush) {
						// Success
						//alert('Success '+resultPush);
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
	
	function getDBValues(field_key) {
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
			},errorHandlerQuery);
		},errorHandlerTransaction,nullHandler);
		return false;
	};
	
	
});

app.directive('dragToDismiss', function($drag, $parse, $timeout){
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem, attrs){
        var dismiss = false;

        $drag.bind(elem, {
          constraint: {
            minX: 0, 
            minY: 0, 
            maxY: 0 
          },
          move: function(c) {
            if( c.left >= c.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function(){
            elem.removeClass('dismiss');
          },
          end: function(c, undo, reset) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() { 
                scope.$apply(function() {
                  dismissFn(scope);  
                });
              }, 400);
            } else {
              reset();
            }
          }
        });
      };
    }
  };
});

//
// Another `$drag` usage example: this is how you could create 
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
app.directive('carousel', function(){
  return {
    restrict: 'C',
    scope: {},
    controller: function($scope) {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount == 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem == this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

app.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();
      
      var zIndex = function(){
        var res = 0;
        if (id == carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(n, o){
        elem[0].style['z-index']=zIndex();
      });
      

      $drag.bind(elem, {
        constraint: { minY: 0, maxY: 0 },
        adaptTransform: function(t, dx, dy, x, y, x0, y0) {
          var maxAngle = 15;
          var velocity = 0.02;
          var r = t.getRotation();
          var newRot = r + Math.round(dx * velocity);
          newRot = Math.min(newRot, maxAngle);
          newRot = Math.max(newRot, -maxAngle);
          t.rotate(-r);
          t.rotate(newRot);
        },
        move: function(c){
          if(c.left >= c.width / 4 || c.left <= -(c.width / 4)) {
            elem.addClass('dismiss');  
          } else {
            elem.removeClass('dismiss');  
          }          
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(c, undo, reset) {
          elem.removeClass('dismiss');
          if(c.left >= c.width / 4) {
            scope.$apply(function() {
              carousel.next();
            });
          } else if (c.left <= -(c.width / 4)) {
            scope.$apply(function() {
              carousel.next();
            });
          }
          reset();
        }
      });
    }
  };
});

app.controller('loginController',function($scope,PPODService,$http,$window,$document){
	fnInit();	
	function fnInit(){       
		
    }
	$scope.submit = function(form, sharedService) {
		$scope.submitted = true;
		if (form.$invalid) {
			return;
		}
		$scope.registration_key = sharedService.registration_key;
		PPODService.loginFunction($scope);	  
	};
});

