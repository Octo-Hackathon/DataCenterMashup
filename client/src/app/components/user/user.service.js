(function() {

  angular.module('octoDatacenter')
  .factory('user', function() {
      var userObj = {
        settings: {
          username: null,
          name: null,
          dataCenterId: null,
          role: null
        }
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
