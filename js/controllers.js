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

		$scope.save = function() {
      	UserService.save();
      	$location.url("/");
   	};

   	$scope.setAuto = function() {
   		$scope.user.location = 'autoip';
   	}

   	$scope.fetchCities = Weather.getCityDetails;

	}]);