angular.module("attWeatherControllers", [])
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