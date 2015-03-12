angular.module("attWeather", [
	"ngRoute",
	"ngAnimate",
	"ui.bootstrap",
	"attWeatherFilters",
	"attWeatherControllers",
	"attWeatherFactories"
	])

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
			        // console.dir(data.forecast);
			      }).error(function(err) {
			         if (localStorage.weatherData) {
			         	d.resolve(angular.fromJson(localStorage.weatherData));
			         } else {
			         	d.reject(err);
			         }
			      });
			      
			      return d.promise;
		    	}
     		};
  		};

  		this.getUrl = function(type, query){
  			return "http://api.wunderground.com/api/" + this.apiKey + "/" + type + "/q/" + query + ".json";
  		};
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
			.when("/pages", {
				templateUrl: "templates/recentPages.html",
				controller: "PagesCtrl"
			})
			.otherwise({
				redirectTo: "/"
			});
	}])

	.config(["WeatherProvider", function(WeatherProvider){
		WeatherProvider.setApiKey("7849e2a87a30dcc7");
	}]);
	