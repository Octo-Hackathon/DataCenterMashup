(function() {

  angular
    .module('octoDatacenter')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider.state({
      name: 'app.main',
      url: '/',
      views: {
        '': {
          templateUrl: 'app/views/main/main.html',
          controller: 'MainController'
        }
      },
      resolve: {
        quarterChartData: function($stateParams, Restangular) {
          return Restangular.one('analytics').one('getTotalCost').get({'quarterYear':'3:2015'});
        },
        serverChartData: function($stateParams, Restangular) {
          return Restangular.one('analytics').one('getQuarterlyServerCounts').get();
        }
      }
    });
  }

})();
