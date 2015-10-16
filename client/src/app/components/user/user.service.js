(function() {

  angular.module('octoDatacenter')
  .factory('user', function() {
      var userObj = {
        settings: {username:'Vernon.Samuel', name: 'Vernon Samuel', dataCenterId: null, role: 'admin'}
      };

      userObj.setUser = function(val) {
        this.settings = val;
      };

      userObj.getUser = function() {
          return this.settings;
      };

      return userObj;
  })
   
})();
