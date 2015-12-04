app.service('BackendService', ['$http', 'BackendConstant', function ($http, BackendConstant) {

  /**
   * Retrieve data for user from server using a POST request
   * @param  {String}   dataType        Type of data to get, ex: 'chapelCredits'
   * @param  {number}   timeout         Custom timeout in milliseconds (optional)
   * @return {promise}                  Fulfilled by response from server
   */
  this.post = function (dataType, timeout) {

    var defaultTimeoutMs = 10000;
    var url = BackendConstant.url + dataType.toLowerCase();

    var credentials = JSON.stringify({
      "username": BackendConstant.username,
      "password": BackendConstant.password
    });

    var config = {
      timeout: timeout || defaultTimeoutMs
    };

    return $http.post(url, credentials, config);
  };
}]);
