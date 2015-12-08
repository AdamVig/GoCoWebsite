app.factory('HighlandFactory', ['DatabaseFactory', 'BackendService', function (DatabaseFactory, BackendService) {

  var highlandFactory = this;
  var endpoint = 'highlandexpress';

  highlandFactory.data = {};

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
  };

  return highlandFactory;
}]);
