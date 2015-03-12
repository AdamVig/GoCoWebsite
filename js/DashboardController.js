app.controller('DashboardController', ['$filter', '$sce', '$interval', 'DatabaseFactory', 'DataService', 'LoginService', 'DatabaseConstant', function ($filter, $sce, $interval, DatabaseFactory, DataService, LoginService, DatabaseConstant) {

  var dashboard = this;
  dashboard.sequenceNumber = null;
  dashboard.usersToDisplay = 10;
  dashboard.refreshInterval = 5000;
  dashboard.db = DatabaseConstant;

  dashboard.auth = {
    "password": "dashboard",
    "userAttempt": null,
    "wrong": false,
    "authenticated": LoginService.checkLogin()
  };

  // Log in to dashboard
  dashboard.login = function () {
    dashboard.auth = LoginService.login(dashboard.auth);
  };

  // Refresh dashboard data
  dashboard.refreshData = function () {

    dashboard.changed = false;

    DatabaseFactory.getChangesSince(dashboard.sequenceNumber)
    .then(function (response) {

      // If data has changed
      if (dashboard.sequenceNumber != response.data.last_seq) {
        // Update with latest sequence number
        dashboard.sequenceNumber = response.data.last_seq;

        dashboard.changed = true;

        // Update users with changes
        dashboard.users = DataService.processChanges(
          dashboard.users.all,
          response.data.results);
      }
    });
  };

  // Get current banner
  DatabaseFactory.get('message').then(function (response) {

    if (response.data.body) {
      dashboard.banner = response.data;
      dashboard.banner.body = $sce.trustAsHtml(dashboard.banner.body);
    }

    // Get all users
    return DatabaseFactory.getAll();
  }).then(function (response) {

    dashboard.users = DataService.processAllUsersResponse(response);

    // Get latest change
    return DatabaseFactory.getLatestChange();
  }).then(function (response) {

    if (response.data.last_seq) {
      dashboard.sequenceNumber = response.data.last_seq;
      $interval(dashboard.refreshData, dashboard.refreshInterval);
    }
  });

}]);
