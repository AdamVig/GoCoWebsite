app.controller('HighlandController', ['LoginService', 'HighlandFactory', function (LoginService, HighlandFactory) {
  var highland = this;
  var pageName = "HighlandExpress";

  highland.loading = true;

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

  highland.refresh();
}]);
