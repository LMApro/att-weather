angular.module("attWeather", [
	"ngRoute",
	"attWeatherFilters",
	"attWeatherControllers",
	"attWeatherFactories",
	"attWeatherDirectives"
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
	}]);

	

	

	