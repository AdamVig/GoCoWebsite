app.factory('HighlandFactory', ['DatabaseFactory', 'BackendService', function (DatabaseFactory, BackendService) {

  var highlandFactory = this;
  var endpoint = 'highlandexpress';

  highlandFactory.data = null;
  highlandFactory.error = null;

  /**
   * Reset error to default value
   */
  function resetError() {
    highlandFactory.error = null;
  }

  /**
   * Handle data response from database
   * @param  {object} response Highland Express doc from database
   */
  function handleResponse(response) {
    highlandFactory.data = response.data.data;
  }

  /**
   * Handle error in database connection
   * @param  {string} error Error message from database
   */
  function handleError(error) {
    if (error.status == 409) { // Conflict
      highlandFactory.error = "Could not save data. Reload the page and try again.";
    } else {
      console.log("Error getting Highland Express data: " + error.data);
    }
  }

  /**
   * Get Highland Express data
   * @return {object} Highland Express data
   */
  highlandFactory.getData = function () {
    resetError();
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
    resetError();
    return BackendService.put(endpoint, highlandDoc)
            .then(handleResponse, handleError);
  };

  /**
   * Add a destination to the schedule
   * @param {string} scheduleDay Which schedule day (weekday, Friday, etc.) to
   *                             modify
   */
  highlandFactory.addScheduleDestination = function (scheduleDay) {
    var daySchedule = highlandFactory.data.schedule[scheduleDay];

    daySchedule.destinations.push("");

    daySchedule.times = _.map(daySchedule.times, function (row) {
      row.push(""); // Modifies in place, returns length of new array
      return row;
    });

    highlandFactory.data.schedule[scheduleDay] = daySchedule;
  };

  /**
   * Add a time to the schedule
   * @param {string} scheduleDay Which schedule day (weekday, Friday, etc.) to
   *                             modify
   */
  highlandFactory.addScheduleTime = function (scheduleDay) {
    var daySchedule = highlandFactory.data.schedule[scheduleDay];
    var numDestinations = daySchedule.destinations.length;

    // Create array of empty strings
    var newTimes = Array(numDestinations).join(".").split(".");

    daySchedule.times.push(newTimes);

    highlandFactory.data.schedule[scheduleDay] = daySchedule;
  };

  /**
   * Remove the last destination from the schedule
   * @param {string} scheduleDay Which schedule day (weekday, Friday, etc.) to
   *                             modify
   */
  highlandFactory.removeScheduleDestination = function (scheduleDay) {
    var daySchedule = highlandFactory.data.schedule[scheduleDay];

    daySchedule.destinations.pop();

    daySchedule.times = _.map(daySchedule.times, function (row) {
      row.pop(); // Modifies in place, returns removed element
      return row;
    });

    highlandFactory.data.schedule[scheduleDay] = daySchedule;
  };

  /**
   * Remove the last row of times from the schedule
   * @param {string} scheduleDay Which schedule day (weekday, Friday, etc.) to
   *                             modify
   */
  highlandFactory.removeScheduleTime = function (scheduleDay) {
    highlandFactory.data.schedule[scheduleDay].times.pop();
  };

  return highlandFactory;
}]);
