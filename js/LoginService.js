app.service('LoginService', ['$timeout', function ($timeout) {

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
      } else if (auth.userAttempt) {
        auth.wrong = true;
      }
    }, timeout);

    return auth;
  };
}]);
