angular.module("attWeatherControllers", [])
	.controller("MainCtrl", ["$scope", "$timeout", "Weather", "UserService", function($scope, $timeout, Weather, UserService){
		$scope.user = UserService.user;
		$scope.date = {};
		$scope.weather = {};

		// Update function
		var updateTime = function(){
			$scope.date.raw = new Date();
			$timeout(updateTime, 1000);
		}

		updateTime();
		
		Weather
			.getWeatherForecast($scope.user.location) //failed
			.then(function(data){ // stop
				localStorage.weatherData = angular.toJson(data);
				$scope.weather.forecast = angular.fromJson(localStorage.weatherData);
				// console.dir(data);
			});
		
	}])

	.controller('SettingsCtrl', ['$scope', "$location", "UserService", "Weather", function($scope, $location, UserService, Weather){
		$scope.user = UserService.user;
		$scope.saved = false;
		$scope.save = function() {
      	if (!$scope.user.name) {
      		$scope.user.name = "Tab mới";
      	}
      	if (!$scope.user.location) {
      		$scope.user.location = "autoip";
      	}
      	UserService.save();
      	$scope.saved = true;
   	};

   	$scope.setAuto = function() {
   		$scope.user.location = 'autoip';
   	};

   	$scope.setDefaultName = function() {
   		$scope.user.name = "Tab mới";
   	};

   	$scope.backToHome = function() {
   		$location.url("/");
   	};

   	$scope.fetchCities = Weather.getCityDetails;

	}]);