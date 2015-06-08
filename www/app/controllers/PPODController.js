document.addEventListener('CallsuccessPage', CallsuccessPage, false);
document.addEventListener('CallfailPage', CallfailPage, false);

function CallsuccessPage() {
	alert('Alert CallsuccessPage');
	//$window.location.href = '#/mainLanding';
};

function CallfailPage() {
	alert('Alert CallfailPage');
	//$window.location.href = '#/mainLanding';
};

app.controller('PPODController',function($scope,PPODService,$http,$window,$document,$rootScope,$cordovaPush,$cordovaSQLite,sharedProperties){    //
	$scope.contactname = "ThoughtNet Technologies (India) Pvt. Ltd";
	initialize();
	$scope.loginTrue = sharedProperties.getIsLogin();
	function initialize() {
		//alert('Hi In initialize');
		if(sharedProperties.getIsLogin() == true){
			$window.location.href = '#/mainLanding';
			return false;
		}	
		$scope.db = null;
        bindEvents();
    };
	
	var androidConfig = {
		"senderID": "74320630987",
	};
	
	function bindEvents() {
		alert('Hi In BindEvents');
        document.addEventListener('deviceready', onDeviceReady, false);
		
    };
	
	
	function onDeviceReady() {
		//alert('Alert onDeviceReady');
		receivedEvent('deviceready');
		PPODService.dbConnection($scope,sharedProperties);
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
	
	$rootScope.$on('loginStatus',function(event,args){
		//alert('BroadCast loginStatus '+args);
		//sharedProperties.setIsLogin(args);
		$scope.loginTrue = args;
	});
	
	
	$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            //alert('registration ID = ' + notification.regid);
			//alert('Hii Came');
			PPODService.AddValueToDB($scope,'reg_id',notification.regid);
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
	
	function getDBValues(field_key) {
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tnet_login_details WHERE field_key = ? ", [field_key],function(transaction, result)
			{
				if (result != null && result.rows != null) {
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
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

app.controller('loginController',function($scope,PPODService,$http,$window,$document,sharedProperties){
	fnInit();
	$scope.instDis = true;
	function fnInit(){
		//alert('Hi Inside loginController');
		if(sharedProperties.getIsLogin() == true){
			$window.location.href = '#/mainLanding';
			return false;
		}
		$scope.loading = true;
		var regkey = sharedProperties.getRegKey();
		var usernameTemp = sharedProperties.getUserName();
		var passwordTemp = sharedProperties.getPassWord();
		var instnameTemp = sharedProperties.getInstName();
		var appId = sharedProperties.getAppId();
		//alert('Reg '+regkey+' Inst Name '+instnameTemp+' UserName '+usernameTemp+' password '+passwordTemp+' appId '+appId);
		if(instnameTemp != '' && usernameTemp != '' && passwordTemp != ''){
			$scope.instName = instnameTemp;
			$scope.userName = usernameTemp;
			$scope.password = passwordTemp;
			$scope.registration_key = regkey;
			$scope.app_id = appId;
			$scope.user_guid = 
			PPODService.loginFunction($scope,sharedProperties);
		}
		else{
			$scope.loading = false;
			//alert('Else Part');
		}
    }
	$scope.submit = function(form) {
		$scope.loading = true;
		$scope.submitted = true;
		$scope.registration_key = sharedProperties.getRegKey();
		if($scope.instName == "" || $scope.instName == null){
			$scope.loading = false;
			alert('Please enter Instance Name, Instance Name field can not be empty');
			return false;
		}
		else if($scope.userName == "" || $scope.userName == null){
			$scope.loading = false;
			alert('Please enter User Name, User Name/id field can not be empty');
			return false;
		}
		else if($scope.password == "" || $scope.password == null){
			$scope.loading = false;
			alert('Please enter password, password field can not be empty');
			return false;
		}
		PPODService.loginFunction($scope,sharedProperties);	  
	};
});


app.controller('mainController',function($scope,PPODService,$http,$window,$document,sharedProperties){
	fnInit();
	function fnInit(){
		//alert('Hi Inside mainController');	
		$scope.stu_name = "Virat Joshi";
		$scope.stu_dob = "01-April-1990";
		$scope.stu_id = "1OY10MCA84";
		$scope.stu_fat_name = "Hemendra Kumar Joshi";
		$scope.stu_mot_name = "Kanta Joshi";
		$scope.stu_fat_mob_no = "+91 8792533839";
		$scope.stu_address = "J. P. Nagar, Bangalore";
		$scope.stu_class = "VI Sem";
		$scope.stu_sec = "VI C Section";
    }
});