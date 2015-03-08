angular.module("attWeatherFilters", [])
	.filter("dayname",["DatetimeService", function(DatetimeService){
			return function(dayOfWeek) {
				var vnName = DatetimeService.vnDateName;
				for (var i = 0; i <= 6; i++) {
					if (dayOfWeek == DatetimeService.engDateName[i]) {
						return vnName[i];
						break;
					} 
				}
			};
		}])

	.filter("dateVn", ["DatetimeService", function(DatetimeService){
			return function(dateString){
				var array = dateString.split(", "),
					dayOfWeek = array[0],
					month = array[1],
					dayOfMonth = array[2];
				for (var i = 0; i <= 6; i++) {
					if (dayOfWeek === DatetimeService.engDateName[i]) {
						dayOfWeek = DatetimeService.vnDateName[i];
						break;
					} 
				}
				for (var i = 0; i <= 11; i++) {
					if (month === DatetimeService.engMonthName[i]) {
						month = " tháng " + (i+1);
						break;
					}
				}
				return dayOfWeek + ", ngày " + dayOfMonth + month + ", " + array[3];
	
			};
		}]);