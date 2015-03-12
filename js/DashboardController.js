app.controller('DashboardController', ['$filter', '$sce', '$timeout', 'DatabaseFactory', 'DataService', 'LoginService', 'DatabaseConstant', function ($filter, $sce, $timeout, DatabaseFactory, DataService, LoginService, DatabaseConstant) {

  var dashboard = this;
  dashboard.usersToDisplay = 10;
  dashboard.db = DatabaseConstant;
  dashboard.auth = {
    "password": "dashboard",
    "userAttempt": null,
    "wrong": false,
    "authenticated": LoginService.checkLogin()
  };

  // Get current banner
  DatabaseFactory.get('message').then(function (response) {
    if (response.data.body) {
      dashboard.banner = response.data;
      dashboard.banner.body = $sce.trustAsHtml(dashboard.banner.body);
    }
  });

  // Get all users
  DatabaseFactory.getAll().then(function (response) {
    dashboard.users = DataService.processAllUsers(response);
  });

  dashboard.login = function () {
    dashboard.auth = LoginService.login(dashboard.auth);
  };

}]);
