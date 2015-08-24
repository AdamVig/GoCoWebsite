app.controller('DashboardController', ['$filter', '$sce', '$interval', '$timeout', 'DatabaseFactory', 'DataService', 'StatsService', 'LoginService', 'LogsService', 'DatabaseConstant', 'LogsConstant', 'NotificationService', function ($filter, $sce, $interval, $timeout, DatabaseFactory, DataService, StatsService, LoginService, LogsService, DatabaseConstant, LogsConstant, NotificationService) {

  var dashboard = this;
  dashboard.config = {
    hideSearchResults: true,
    usersToDisplay: 10,
    refreshInterval: 5000,
    notifySound: false,
    showTotalUsers: false
  };
  dashboard.loading = true;
  dashboard.sequenceNumber = null;
  dashboard.db = DatabaseConstant;
  dashboard.logs = LogsConstant;

  NotificationService.requestDesktopPermission();

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

  dashboard.toggleSound = function () {
    dashboard.config.notifySound = !dashboard.config.notifySound;

    if (dashboard.config.notifySound) {
      NotificationService.notifySound();
    }
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

        var oldUsers = dashboard.users;

        dashboard.changed = true;

        // Update users with changes
        dashboard.users = DataService.processChanges(
          dashboard.users.all,
          response.data.results);

        // Update statistics
        dashboard.stats = StatsService.getStatistics(
          dashboard.users.all, dashboard.appInfo);

        // If new user
        if (dashboard.users.filtered.new.length >
              oldUsers.filtered.new.length) {

          // Play sound if enabled
          if (dashboard.config.notifySound) {
            NotificationService.notifySound();
          }

          // Notify
          NotificationService.flashTitle("New user!");
          NotificationService.notifyDesktop(
            "A new user downloaded GoCo Student.",
            "New User!");
        }
      }
    });
  };

  // Wait for page animations to finish, then load data
  $timeout(function () {

    DatabaseFactory.getAll().then(function (response) {

      dashboard.appInfo = DataService.getAppInfo(response);

      if (dashboard.appInfo.banner.title) {
        dashboard.banner = dashboard.appInfo.banner;
        dashboard.banner.body = $sce.trustAsHtml(dashboard.banner.body);
      }

      dashboard.users = DataService.processAllUsersResponse(response);
      dashboard.stats = StatsService.getStatistics(
        dashboard.users.all, dashboard.appInfo);

      // Get database info
      return DatabaseFactory.getInfo();
    }).then(function (response) {

      dashboard.loading = false;

      // Save update sequence number and start refresh
      if (response.data.update_seq) {
        dashboard.sequenceNumber = response.data.update_seq;
        $interval(dashboard.refreshData, dashboard.config.refreshInterval);
      }
    });

    LogsService.getLogs().then(function (response) {
      dashboard.logs = response.data.events.reverse();
    });
  }, 1000);
}]);
