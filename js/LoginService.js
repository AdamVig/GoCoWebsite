app.service('LoginService', ['$timeout', '$window', function ($timeout, $window) {

  var storagePrefix = 'GoCoDashboard';
  var storageSuffix = 'Authenticated';

  /**
   * Get name to use for storing authentication data
   * @param  {string} pageName Name of page, can be undefined
   * @return {string}          Name to use for storing auth data
   */
  function getStorageName(pageName) {
    var separator = '.';
    var storageName = storagePrefix + separator;

    if (pageName) {
      storageName += pageName + separator;
    }

    storageName += storageSuffix;

    return storageName;
  }

  /**
   * Log in
   * @param  {object} auth     Contains: password, userAttempt, wrong,
   *                           and authenticated
   * @param  {string} pageName Name of page
   * @return {object}          Contains: password, userAttempt, wrong,
   *                           and authenticated
   */
  this.login = function (auth, pageName) {
    var timeout = 100;

    if (auth.wrong === true) {
      timeout = 500;
      auth.wrong = false;
    }

    // Short delay to indicate password is still wrong
    $timeout(function () {
      if (auth.userAttempt == auth.password) {
        auth.authenticated = true;
        var storageName = getStorageName(pageName);
        $window.localStorage[storageName] = true;
      } else if (auth.userAttempt) {
        auth.wrong = true;
      }
    }, timeout);

    return auth;
  };

  /**
   * Check if logged in
   * @param  {string} pageName Name of page
   * @return {boolean}    true if logged in, false if not
   */
  this.checkLogin = function (pageName) {
    var storageName = getStorageName(pageName);
    return $window.localStorage[storageName] || false;
  };
}]);
