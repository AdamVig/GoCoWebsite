app.controller('DashboardController', ['$filter', '$sce', '$timeout', 'DatabaseFactory', 'DataService', 'DatabaseConstant', function ($filter, $sce, $timeout, DatabaseFactory, DataService, DatabaseConstant) {

  var dashboard = this;
  dashboard.usersToDisplay = 10;
  dashboard.db = DatabaseConstant;
  dashboard.authenticated = false;
  dashboard.password = {
    "correct": "dashboard",
    "attempt": null,
    "failure": false
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

  /**
   * Login to access dashboard
   */
  dashboard.login = function () {
    var timeout = 100;

    if (dashboard.password.failure === true) {
      timeout = 500;
      dashboard.password.failure = false;
    }

    // Short delay to indicate password is still wrong
    $timeout(function () {
      if (dashboard.password.attempt == dashboard.password.correct) {
        dashboard.authenticated = true;
      } else {
        dashboard.password.failure = true;
      }
    }, timeout);
  };

}]);
