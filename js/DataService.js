app.service('DataService', ['$filter', function ($filter) {

  /**
   * Process all users from database response
   * @param {object} response Contains data, status, etc.
   */
  this.processAllUsers = function (response) {

    var orderBy = $filter('orderBy');

    var allUsers = extractDocs(response);
    allUsers = removeNonUserDocs(allUsers);
    allUsers = getUserNames(allUsers);
    allUsers = removeDatabaseProperties(allUsers);

    var users = {};
    users.recent = orderBy(allUsers,
      function (user) { return new Date(user.lastLogin); },
      true);
    users.new = orderBy(allUsers,
      function (user) { return new Date(user.firstLogin); },
      true);
    users.frequent = orderBy(allUsers, 'totalLogins', true);

    var totalUsers = allUsers.length;

    return {
      "all": allUsers,
      "filtered": users,
      "total": totalUsers
    };
  };

  /**
   * Extract docs
   * @param {object} response Contains data, status, etc.
   * @return {array}          Contains all docs from response
   */
  function extractDocs(response) {
    return response.data.rows.map(function (metaDoc) {
      return metaDoc.doc;
    });
  }

  /**
   * Remove non-user docs from array of docs
   * @param {array} allDocs Contains doc objects
   * @return {array}        Contains only user doc objects
   */
  function removeNonUserDocs (allDocs) {
    return allDocs.filter(function (doc) {
      if (doc._id.indexOf('.') > -1) {
        return doc;
      }
    });
  }

  /**
   * Get names of users
   * @param {array} allUsers Contains user docs
   * @return {array}         Contains user docs containing name objects
   */
  function getUserNames(allUsers) {
    return allUsers.map(function (user) {
      var nameSplit = user._id.split('.');
      user.name = {
        "first": capitalizeFirstLetter(nameSplit[0]),
        "last": capitalizeFirstLetter(nameSplit[1]),
        "id": user._id
      };
      user.name.full = user.name.first + " " + user.name.last;

      return user;
    });
  }

  /**
   * Remove database properties _id and _rev from user docs
   * @param {array} allUsers Contains user docs
   */
  function removeDatabaseProperties(allUsers) {
    return allUsers.map(function (user) {
      delete user._id;
      delete user._rev;
      return user;
    });
  }

  /**
   * Capitalize first letter of a string
   * @param {String}  string String to capitalize
   * @return {String}        Capitalized string
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}]);
