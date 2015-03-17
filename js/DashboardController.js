app.controller('DashboardController', ['$filter', '$sce', '$interval', 'DatabaseFactory', 'DataService', 'LoginService', 'DatabaseConstant', 'RefreshService', function ($filter, $sce, $interval, DatabaseFactory, DataService, LoginService, DatabaseConstant, RefreshService) {

  var dashboard = this;
  dashboard.loading = true;
  dashboard.hideSearchResults = true;
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

      // Update with latest sequence number
      dashboard.sequenceNumber = response.data.last_seq;

      // If data has changed
      if (response.data.results.length > 0) {

        dashboard.changed = true;
        RefreshService.flashTitle();

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

    // Get database info
    return DatabaseFactory.getInfo();
  }).then(function (response) {

    dashboard.loading = false;

    // Save update sequence number and start refresh
    if (response.data.update_seq) {
      dashboard.sequenceNumber = response.data.update_seq;
      $interval(dashboard.refreshData, dashboard.refreshInterval);
    }
  });

}]);
