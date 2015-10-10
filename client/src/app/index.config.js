/*global location */
(function() {

  angular
    .module('octoDatacenter')
    .config(config);

  /** @ngInject */

  function config($logProvider, RestangularProvider, env) {

    // Enable log
    $logProvider.debugEnabled(true);
    
    RestangularProvider.setBaseUrl(location.protocol + '//' + location.hostname + ':3000/' + env.apiUrl);
    
    if (env.authToken) {
      RestangularProvider.setDefaultHeaders(
        {Authorization: env.authToken}
      );
    }

  }

})();
