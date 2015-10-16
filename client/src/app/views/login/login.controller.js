(function() {

  angular.module('octoDatacenter')
    .controller('LoginController', /** @ngInject */ function ($scope, user, $state, toastr) {

      $scope.email = '';

      $scope.login = function(test) {

        if($scope.email == "Sue.Jane") {
          toastr.success('Logged in.');
          user.setUser({username:'Sue.Jane', name: 'Sue Jane', dataCenterId: 1, role: 'staff'});
          $state.go('app.main');
        }
        else if($scope.email == "Vernon.Samuel") {
          toastr.success('Logged in.');
          user.setUser({username:'Vernon.Samuel', name: 'Vernon Samuel', dataCenterId: null, role: 'admin'});
          $state.go('app.main');
        }
        else {
          toastr.error('Invalid Login.');
        }
      };
    });

})();
