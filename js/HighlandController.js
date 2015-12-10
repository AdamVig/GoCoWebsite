app.controller('HighlandController', ['LoginService', 'HighlandFactory', function (LoginService, HighlandFactory) {
  var highland = this;
  var pageName = "HighlandExpress";

  highland.loading = true;
  highland.saving = {
    "announcementForm": false,
    "scheduleForm": false
  };
  highland.error = {
    "announcementForm": null,
    "scheduleForm": null
  };
  highland.data = null;

  highland.noDataErrorMessage = "Whoops! Something went wrong. Please reload the page and try again.";

  highland.auth = {
    "password": "highland-staff",
    "userAttempt": null,
    "wrong": false,
    "authenticated": LoginService.checkLogin(pageName)
  };

  // Log in to dashboard
  highland.login = function () {
    highland.auth = LoginService.login(highland.auth, pageName);
  };

  // Refresh all data
  highland.refresh = function () {
    HighlandFactory.getData().then(function () {
      highland.data = HighlandFactory.data;
      highland.loading = false;
    });
  };

  // Change to next schedule day
  highland.nextSchedule = function () {
    index = highland.data.days.indexOf(highland.data.day);
    if (index + 1 < highland.data.days.length) {
      highland.data.day = highland.data.days[index + 1];
    } else {
      highland.data.day = highland.data.days[0];
    }
  };

  // Save changes to database
  highland.save = function (formName) {
    highland.saving[formName] = true;
    HighlandFactory.saveData(highland.data).then(function () {
      if (HighlandFactory.error) {
        highland.error[formName] = HighlandFactory.error;
      } else {
        highland.data = HighlandFactory.data;
      }
      highland.saving[formName] = false;
    });
  };

  // Add time to schedule
  highland.addScheduleTime = function (scheduleDay) {
    HighlandFactory.addScheduleTime(scheduleDay);
    highland.data = HighlandFactory.data;
  };

  // Add destination to schedule
  highland.addScheduleDestination = function (scheduleDay) {
    HighlandFactory.addScheduleDestination(scheduleDay);
    highland.data = HighlandFactory.data;
  };

  // Remove time from schedule
  highland.removeScheduleTime = function (scheduleDay) {
    HighlandFactory.removeScheduleTime(scheduleDay);
    highland.data = HighlandFactory.data;
  };

  // Remove destination from schedule
  highland.removeScheduleDestination = function (scheduleDay) {
    HighlandFactory.removeScheduleDestination(scheduleDay);
    highland.data = HighlandFactory.data;
  };

  highland.refresh();
}]);
