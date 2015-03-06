angular.module("myApp", ["ngRoute"])

	.provider("Weather", function(){
		var apiKey = "";

		this.setApiKey = function(key) {
      	if (key) this.apiKey = key;
   	};

  		this.$get = function($q, $http) {
   		var self = this;
   		return {
      		getWeatherForecast: function(city) {
			      var d = $q.defer();
			      $http({
			        method: 'GET',
			        url: self.getUrl("forecast", city),
			        cache: true
			      }).success(function(data) {
			        // The wunderground API returns the 
			        // object that nests the forecasts inside
			        // the forecast.simpleforecast key
			        d.resolve(data.forecast.simpleforecast);
			      }).error(function(err) {
			         d.reject(err);
			      });
			      return d.promise;
		    	},

		    	getCityDetails: function(query) {
		    		var d = $q.defer();
		    		$http({
		    			method: "GET",
		    			url: "http://autocomplete.wunderground.com/" + "aq?query=" + query
		    		}).success(function(data){
		    			d.resolve(data.RESULTS);
		    			
		    		}).error(function(err){
		    			d.reject(err);
		    		});
		    		return d.promise;
		    	}
     		};
  		};

  		this.getUrl = function(type, ext){
  			return "http://api.wunderground.com/api/" + this.apiKey + "/" + type + "/q/" + ext + ".json";
  		};
	})

	.factory("UserService", function(){
		var defaults = {
   		location: 'autoip'
   	};

   	var service = {
   		user: {},

      	save: function() {
      		sessionStorage.attweather = angular.toJson(service.user);
         },

         restore: function() {
      		// Pull from sessionStorage
      		service.user = angular.fromJson(sessionStorage.attweather) || defaults;

         	return service.user;
      	}
      };

      service.restore();
   	return service;
	})

	.config(["$routeProvider", function($routeProvider){
		$routeProvider
			.when("/", {
				templateUrl: "templates/home.html",
				controller: "MainCtrl"
			})
			.when("/settings", {
				templateUrl: "templates/settings.html",
				controller: "SettingsCtrl"
			})
			.otherwise({
				redirectTo: "/"
			});
	}])

	.config(["WeatherProvider", function(WeatherProvider){
		WeatherProvider.setApiKey("7849e2a87a30dcc7");
	}])

	.controller("MainCtrl", ["$scope", "$timeout", "Weather", "UserService", function($scope, $timeout, Weather, UserService){
		
		$scope.user = UserService.user;
		// Build the date object
		$scope.date = {};

		// Update function
		var updateTime = function(){
			$scope.date.raw = new Date();
			$timeout(updateTime, 1000);
		}

		updateTime();

		$scope.weather = {};
		
		Weather
			.getWeatherForecast($scope.user.location)
			.then(function(data){
				$scope.weather.forecast = data;
			});
		
	}])

	.controller('SettingsCtrl', ['$scope', "$location", "UserService", "Weather", function($scope, $location, UserService, Weather){
		$scope.user = UserService.user;

		$scope.save = function() {
      	UserService.save();
      	$location.url("/");
   	};

   	$scope.fetchCities = Weather.getCityDetails;

	}])

	.directive("autofill", function($timeout){
		return {
			restrict: "EA",
			scope: {
				autoFill: "&",
				ngModel: '='
			},
			compile: function(elem, attrs){
				var tplEl = angular.element('<div class="typeahead">' +
				   '<input type="text" autocomplete="off" />' +
				   '<ul id="autolist" ng-show="reslist">' +
				   '<li ng-repeat="res in reslist" ' +
				      '>{{res.name}}</li>' +
				   '</ul>' +
				   '</div>');
				   var input = tplEl.find('input');
				   input.attr('type', attrs.type);
				   input.attr('ng-model', attrs.ngModel);
				   input.attr("timezone", attrs.timezone);
				   elem.replaceWith(tplEl);
				
				return function(scope, ele, attrs, ctrl){
					var minKeyCount = attrs.minKeyCount || 3,
      				timer,
      				input = ele.find('input');

   				input.bind('keyup', function(e) {
      				val = ele.val();
     					if (val.length < minKeyCount) {
      					if (timer) $timeout.cancel(timer);
      					scope.reslist = null;
      					return;
    					} else {
  							if (timer) $timeout.cancel(timer);
   						timer = $timeout(function() {
     						scope.autofill()(val)
     							.then(function(data) {
         						if (data && data.length > 0) {
         							scope.reslist = data;
         							scope.ngModel = data[0].zmw;
         							scope.timezone = data[0].tz;
         						}
      						});
   						}, 300);
 						}
  					});

   				// Hide the reslist on blur
  					input.bind('blur', function(e) {
   					scope.reslist = null;
   					scope.$digest();
   				});
				};
			}
		};
	});