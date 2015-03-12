angular.module("attWeatherDirectives", [])
	/*.directive("autofill", function($timeout){
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
	})*/;