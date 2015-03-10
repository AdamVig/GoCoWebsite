app.controller('DashboardController', ['$filter', 'DatabaseFactory', 'DataService', 'DatabaseConstant', function ($filter, DatabaseFactory, DataService, DatabaseConstant) {

  var dashboard = this;
  dashboard.usersToDisplay = 10;
  dashboard.db = DatabaseConstant;
  dashboard.authenticated = false;
  dashboard.password = {
    "correct": "dashboard",
    "attempt": null
  };

  // Get current banner
  DatabaseFactory.get('message').then(function (response) {
    dashboard.banner = response.data.body ? response.data : null;
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

  /**
   * Login to access dashboard
   */
  dashboard.login = function () {
    if (dashboard.password.attempt == dashboard.password.correct) {
      dashboard.authenticated = true;
    }
  };

}]);
