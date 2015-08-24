app.service('LogsService', ['$http', 'LogsConstant', function ($http, LogsConstant) {
  var LogsService = this;

  /**
   * Get last 100 log entries from log provider
   * @return {promise} Fulfilled by object
   */
  this.getLogs = function () {

    var url = LogsConstant.apiURL + 'events/search.json';

    var config = {
      'headers': {'X-Papertrail-Token': LogsConstant.token},
      'params': {'format': 'json'}
    };

    return $http.get(url, config);
  };
}]);
