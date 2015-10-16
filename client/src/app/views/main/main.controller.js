(function() {

  angular.module('octoDatacenter')
    .controller('MainController', /** @ngInject */ function ($scope, $filter, quarterChartData, serverChartData, storageChartData) {
		  $scope.mainChart = {};
		  $scope.mainChart.labels = quarterChartData.result.quarters;
		  $scope.mainChart.data = [quarterChartData.result.totalCosts];

			$scope.mainChart.colors = [{
				fillColor: 'rgba(60,141,188,0.7)',
				strokeColor: 'rgba(60,141,188,0.9)',
				highlightFill: 'rgba(60,141,188,0.9)',
				highlightStroke: 'rgba(60,141,188,0.9)'
			}];

		  $scope.mainChart.options = {
		  	scaleLabel: function (valuePayload) {
			    return $filter('currency')(valuePayload.value, '$', 0);
				},
				tooltipTemplate: function (valuePayload) {
			    return valuePayload.label + " - " + $filter('currency')(valuePayload.value, '$', 0);
				}
		  }

		  $scope.serverChart = {};

		  $scope.serverChart.labels = serverChartData.results.quarters;
		  $scope.serverChart.data = serverChartData.results.counts

		  $scope.serverChart.series = serverChartData.results.labels;

			$scope.serverChart.colors = ['#f56954','#00a65a','#f39c12','#00c0ef'];

		  $scope.storageChart = {};

		  $scope.storageChart.labels = storageChartData.results.quarters;
		  $scope.storageChart.data = storageChartData.results.counts

		  $scope.storageChart.series = storageChartData.results.labels;

			$scope.storageChart.colors = ['#f56954','#00a65a'];

    });

})();
