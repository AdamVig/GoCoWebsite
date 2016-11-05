app.service('BackendService', ['$http', 'BackendConstant', function ($http, BackendConstant) {

  /**
   * Retrieve data from server using a GET request
   * @param  {String}   dataType        Type of data to get, ex: 'chapelCredits'
   * @param  {number}   timeout         Custom timeout in milliseconds (optional)
   * @return {promise}                  Fulfilled by response from server
   */
  this.get = function (dataType, timeout) {

    var defaultTimeoutMs = 10000;
    var url = BackendConstant.url + dataType.toLowerCase();

    var credentials = {
      "username": BackendConstant.username,
      "password": BackendConstant.password
    };

    // Request configuration
    var config = {
      params: credentials,
      timeout: timeout || defaultTimeoutMs
    };

    return $http.get(url, config);
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

      return $http.put(url, {data: payload}, config);
  };
}]);
