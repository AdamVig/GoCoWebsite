app.service('LoginService', ['$timeout', '$window', function ($timeout, $window) {

  /**
   * Log in
   * @param  {object} auth Contains: password, userAttempt, wrong,
   *                       and authenticated
   * @return {object}      Contains: password, userAttempt, wrong,
   *                       and authenticated
   */
  this.login = function (auth) {
    var timeout = 100;

    if (auth.wrong === true) {
      timeout = 500;
      auth.wrong = false;
    }

    // Short delay to indicate password is still wrong
    $timeout(function () {
      if (auth.userAttempt == auth.password) {
        auth.authenticated = true;
        $window.localStorage['GoCoDashboard.Authenticated'] = true;
      } else if (auth.userAttempt) {
        auth.wrong = true;
      }
    }, timeout);

    return auth;
  };

  /**
   * Check if logged in
   * @return {boolean}    true if logged in, false if not
   */
  this.checkLogin = function () {
    return $window.localStorage['GoCoDashboard.Authenticated'] || false;
  };
}]);
