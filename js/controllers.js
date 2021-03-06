angular.module("attWeatherControllers", [])
	.controller("WeatherCtrl", ["$scope", "$timeout", "Weather", "UserService", function($scope, $timeout, Weather, UserService){
		$scope.user    = UserService.user;
		$scope.date    = {};
		$scope.weather = {};

		// make the clock
		var updateTime = function(){
			$scope.date.raw = new Date();
			$timeout(updateTime, 1000);
		};

		updateTime();

		$scope.getLatLon = function(latlon) {
			if (latlon !== "autoip") {
				var start = latlon.indexOf("[");
				var end = latlon.indexOf("]");
				return latlon.substring(start + 1, end - 1);
			} else {
				return "autoip";
			}
		};

		if ($scope.user.location) {
			Weather
				.getWeatherForecast($scope.getLatLon($scope.user.location))
				.then(function(data){
					localStorage.weatherData = angular.toJson(data);
					$scope.weather.forecast  = angular.fromJson(localStorage.weatherData);
				});
		} else {
			Weather
				.getWeatherForecast("autoip")
				.then(function(data){
					localStorage.weatherData = angular.toJson(data);
					$scope.weather.forecast  = angular.fromJson(localStorage.weatherData);
				});
		}
	}])

	.controller('SettingsCtrl', ['$scope', "$location", "UserService", "Weather", "$http", function($scope, $location, UserService, Weather, $http){
		$scope.user     = UserService.user;
		$scope.saved    = true;
		
		$scope.save  = function() {
      	if (!$scope.user.name) {
      		$scope.user.name = "Tab mới";
      	}
      	if (!$scope.user.location) {
      		$scope.user.location = "autoip";
      	}
      	UserService.save();
      	$scope.saved = true;
   	};

   	$scope.setAutoIp = function() {
   		$scope.saved = false;
   		$scope.user.location = 'autoip';
   	};

   	$scope.setDefaultName = function() {
   		$scope.saved = false;
   		$scope.user.name = "Tab mới";
   	};

   	$scope.location = function(route) {
   		$location.url(route);
   	};

   	$scope.getSettings = function() {
   		return angular.fromJson(localStorage.attweather);
   	};

   	$scope.changingSettings = function() {
   		if (($scope.user.location !== $scope.getSettings().location) || ($scope.user.name !== $scope.getSettings().name) || ($scope.user.tempType !== $scope.getSettings().tempType)) {
   			$scope.saved = false;
   		} else {
   			$scope.saved = true;
   		}
   	};

   	$scope.getLocation = function(city) {
		   return $http({
		   	method: "GET",
		   	url: "http://autocomplete.wunderground.com/" + "aq?query=" + city
		   }).then(function(response){
		   	return response.data.RESULTS
		   		.map(function(item){
			   		return {
							lat: item.lat,
							lon: item.lon,
							name: item.name
			   		};
		   		})
		   		.filter(function(item){
		   			return item.lat != -9999 && item.lon != -9999;
		   		})
		   		.map(function(item){
			   		return item.name + " [" + item.lat + "," + item.lon + "]";
		   		});
		  
		   });
   	};

   	$scope.logTempType = function() {
   		console.log($scope.user.tempType);
   	};

	}])

	.controller("PagesCtrl", ["$scope", function($scope){
		$scope.pages = [
			{
				link: "http://www.google.com",
				title: "Google"
			}, 
			{
				link: "http://www.tinhte.vn",
				title: "Tinhte"
			},
			{
				link: "http://kenh14.vn",
				title: "Kenh 14"
			},
			{
				link: "http://genk.vn",
				title: "Genk"
			},
			{
				link: "http://mp3.zing.vn",
				title: "MP3 zing"
			},
			{
				link: "http://www.facebook.com",
				title: "Facebook"
			},
			{
				link: "http://youtube.com",
				title: "Youtube"
			},
			{
				link: "http://maps.google.com",
				title: "Google maps"
			},
			{
				link: "http://sis.hust.edu.vn",
				title: "SIS"
			}
		];
	}]);