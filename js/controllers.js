angular.module("attWeatherControllers", [])
	.controller("MainCtrl", ["$scope", "$timeout", "Weather", "UserService", function($scope, $timeout, Weather, UserService){
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
				return latlon.substring(start+1, end-1);
			} else {
				return "autoip";
			}
			
		};

		Weather
			.getWeatherForecast($scope.getLatLon($scope.user.location))
			.then(function(data){
				localStorage.weatherData = angular.toJson(data);
				$scope.weather.forecast  = angular.fromJson(localStorage.weatherData);
				// console.dir(data);
			});
		
	}])

	.controller('SettingsCtrl', ['$scope', "$location", "UserService", "Weather", "$http", function($scope, $location, UserService, Weather, $http){
		$scope.user  = UserService.user;
		$scope.saved = false;
		$scope.save  = function() {
      	if (!$scope.user.name) {
      		$scope.user.name = "Tab mới";
      	}
      	if (!$scope.user.location) {
      		$scope.user.location = "autoip";
      	}
      	// $scope.user.location = $scope.cityStrings[$scope.cities.indexOf($scope.user.location)];
      	UserService.save();
      	$scope.saved = true;
   	};

   	$scope.setAutoIp = function() {
   		$scope.user.location = 'autoip';
   	};

   	$scope.setDefaultName = function() {
   		$scope.user.name = "Tab mới";
   	};

   	$scope.backToHome = function() {
   		$location.url("/");
   	};

   	$scope.getLocation = function(val) {
		   return $http({
		   	method: "GET",
		   	url: "http://autocomplete.wunderground.com/" + "aq?query=" + val
		   }).then(function(response){
		   	// console.log(response);
		   	return response.data.RESULTS.map(function(item){
		   		var result = item.name + " [" + item.lat + "," + item.lon + "]";
		   		// console.log(result);
		   		return result;
		   	});
		  
		   });
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