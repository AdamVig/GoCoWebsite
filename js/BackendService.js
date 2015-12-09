app.service('BackendService', ['$http', 'BackendConstant', function ($http, BackendConstant) {

  /**
   * Retrieve data from server using a POST request
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

  /**
   * Save data to server using a PUT request
   * @param  {String}   endpoint Endpoint to PUT to, ex: 'highlandExpress'
   * @param  {object}   payload  Data to PUT
   * @param  {number}   timeout  Custom timeout in milliseconds (optional)
   * @return {promise}           Fulfilled by response from server
   */
  this.put = function (endpoint, payload, timeout) {

    var defaultTimeoutMs = 10000;
    var url = BackendConstant.url + endpoint.toLowerCase();

    var config = {
      timeout: timeout || defaultTimeoutMs
    };

    return $http.put(url, payload, config);
  };
}]);
