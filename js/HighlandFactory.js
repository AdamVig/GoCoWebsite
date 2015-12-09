app.factory('HighlandFactory', ['DatabaseFactory', 'BackendService', function (DatabaseFactory, BackendService) {

  var highlandFactory = this;
  var endpoint = 'highlandexpress';

  highlandFactory.data = null;

  /**
   * Handle data response from database
   * @param  {object} response Highland Express doc from database
   */
  function handleResponse(response) {
    highlandFactory.data = response.data;
  }

  /**
   * Handle error in database connection
   * @param  {string} error Error message from database
   */
  function handleError(error) {
    console.log("Error getting Highland Express data: " + error);
  }

  /**
   * Get Highland Express data
   * @return {object} Highland Express data
   */
  highlandFactory.getData = function () {
    return BackendService.post(endpoint)
            .then(handleResponse, handleError);
  };

  /**
   * Save Highland Express data
   * @param  {object} highlandDoc Highland Express data in database doc format
   * @return {object}             updated Highland Express data in database
   *                              doc format
   */
  highlandFactory.saveData = function (highlandDoc) {
    return BackendService.put(endpoint, highlandDoc)
            .then(handleResponse, handleError);
  };

  return highlandFactory;
}]);
