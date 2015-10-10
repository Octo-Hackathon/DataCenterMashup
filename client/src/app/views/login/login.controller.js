(function() {

  angular.module('octoDatacenter')
    .controller('LoginController', /** @ngInject */ function ($scope, $modal, auth, $state, toastr) {

      angular.element('#emailInput').focus();

      $scope.openSignInHelpModal = function () {
        $modal.open({
          animation: true,
          templateUrl: 'sign-in-help.html',
          controller: 'BasicModalCtrl'
        });
      };

      $scope.openTermsModal = function () {
        $modal.open({
          animation: true,
          templateUrl: 'terms-and-conditions.html',
          controller: 'BasicModalCtrl'
        });
      };

      $scope.login = function(email, password) {
        auth.login(email, password).then(function() {
          $state.go('app.main');
        }, function() {
          toastr.error('Login failed');
        });
      };
    })
    .controller('BasicModalCtrl', function ($scope, $modalInstance) {
      $scope.close = function () {
        $modalInstance.dismiss('cancel');
      };
    });

})();
