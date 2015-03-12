app.controller('DashboardController', ['$filter', '$sce', '$timeout', 'DatabaseFactory', 'DataService', 'LoginService', 'DatabaseConstant', function ($filter, $sce, $timeout, DatabaseFactory, DataService, LoginService, DatabaseConstant) {

  var dashboard = this;
  dashboard.usersToDisplay = 10;
  dashboard.db = DatabaseConstant;
  dashboard.auth = {
    "password": "dashboard",
    "userAttempt": null,
    "wrong": false,
    "authenticated": false
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

    dashboard.allUsers = DataService.extractDocs(response);
    dashboard.allUsers = DataService.cleanUsers(dashboard.allUsers);
    dashboard.totalUsers = dashboard.allUsers.length;
    dashboard.users = {
      'recent': $filter('orderBy')(dashboard.allUsers, 'lastLogin', true),
      'frequent': $filter('orderBy')(dashboard.allUsers, 'totalLogins', true),
      'new': $filter('orderBy')(dashboard.allUsers, 'firstLogin', true)
    };
  });

  dashboard.login = function () {
    dashboard.auth = LoginService.login(dashboard.auth);
  };

}]);
