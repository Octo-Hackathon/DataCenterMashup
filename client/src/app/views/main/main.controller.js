(function() {

  angular.module('octoDatacenter')
    .controller('MainController', /** @ngInject */ function ($scope, $filter) {
		  $scope.labels = ["Q1 2014", "Q2 2014", "Q3 2015", "Q4 2015"];
		  $scope.data = [
		    [333444, 234567, 345367, 232222]
		  ];

			$scope.colors = [{
				fillColor: 'rgba(60,141,188,0.7)',
				strokeColor: 'rgba(60,141,188,0.9)',
				highlightFill: 'rgba(60,141,188,0.9)',
				highlightStroke: 'rgba(60,141,188,0.9)'
			}];

		  $scope.options = {
		  	scaleLabel: function (valuePayload) {
			    return $filter('currency')(valuePayload.value, '$', 0);
				}
		  }
    });

})();
