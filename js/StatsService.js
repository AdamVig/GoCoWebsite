app.service('StatsService', [function () {

  /**
   * Get statistics about users
   * @param {array} allUsers Contains user docs
   * @param {object} appInfo Contains info about app
   * @return {object}        Contains schoolPercentage, usersPerDay,
   *                         and lastLogin
   */
  this.getStatistics = function (allUsers, appInfo) {
    return {
      'schoolPercentage': getSchoolPercentage(
        allUsers.length, appInfo.totalStudents),
      'usersPerDay': getUsersPerDay(allUsers),
      'lastLogin': getLastLoginTime(allUsers),
      'totalLogins': getTotalLogins(allUsers)
    };
  };

  /**
   * Get percentage of students at school that are users of the app
   * @param {number} totalUsers     Total number of users of the app
   * @param {number} schoolStudents Total number of students at the school
   * @return {number}               Percentage of the school using the app
   */
   function getSchoolPercentage(totalUsers, schoolStudents) {
    return Math.round(totalUsers / schoolStudents * 100);
  }

  /**
   * Get average number of new users per day (excluding days on which
   * nobody logged in for the first time)
   *
   * 1. Create object of 'firstLogin' dates with number of users who
   * first logged in on each date. ex: {'1/1/15': 23}
   * 2. Average number of users who first logged in on each date.
   *
   * @param {array} allUsers Contains user docs
   * @return {number}        Average number of new users per day
   */
   function getUsersPerDay(allUsers) {

    var firstLogins = {},
        earliestLogin,
        allDates = [],
        totalFirstLogins = 0,
        numDays = 0;

    allUsers.map(function (user) {

      var firstLogin = moment(user.firstLogin, 'MM/DD/YY h:m a');
      allDates.push(firstLogin);
      firstLogin = firstLogin.format('MM/DD/YY');

      // Increment existing firstLogin date
      if (firstLogin in firstLogins) {
        firstLogins[firstLogin]++;

      // Add a new firstLogin date
      } else {
        firstLogins[firstLogin] = 1;
      }

      totalFirstLogins++;
    });

    earliestLogin = moment.min(allDates);
    numDays = moment().diff(earliestLogin, 'days');

    return Math.round(totalFirstLogins/numDays);
  }

  /**
   * Get average time since last login
   *
   * 1. For each user, get time since last login in milliseconds.
   * 2. Calculate average number of milliseconds since last login.
   * 3. Convert milliseconds to a human-readable duration.
   *
   * @param {array} allUsers Contains user docs
   * @return {string}        Average time since last login
   */
  function getLastLoginTime(allUsers) {

    var averageTime = 0,
        totalLogins = 0;

    allUsers.map(function (user) {
      var lastLogin = moment(user.lastLogin, 'MM/DD/YY h:m a');
      averageTime += moment().diff(lastLogin);
      totalLogins++;
    });

    return moment.duration(averageTime / totalLogins * -1).humanize(true);
  }

  /**
   * Get average total logins
   * @param {array} allUsers Contains user docs
   * @return {number}        Average total logins
   */
  function getTotalLogins(allUsers) {

    var sum = allUsers.reduce(function (sum, user) {
      return sum + user.totalLogins;
    }, 0);

    return Math.round(sum / allUsers.length);
  }

}]);
