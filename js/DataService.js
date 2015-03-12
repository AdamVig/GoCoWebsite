app.service('DataService', ['$filter', function ($filter) {

  var DataService = this;

  /**
   * Process all users from database response
   * @param {object} response Contains data, status, etc.
   */
  this.processAllUsersResponse = function (response) {
    var allDocs = extractDocs(response.data.rows);
    var allUsers = removeNonUserDocs(allDocs);

    return DataService.processAllUsers(allUsers);
  };

  /**
   * Process all users
   * @param {array} allUsers Contains user docs
   */
  this.processAllUsers = function (allUsers) {

    allUsers = getUserNames(allUsers);
    allUsers = removeDatabaseProperties(allUsers);

    return outputUsers(allUsers);
  };

  /**
   * Update all users with changes
   * @param {array} allUsers Contains user docs
   * @param {array} changes Contains changed user docs
   */
  this.processChanges = function (allUsers, changes) {

    // Process changed docs
    changes = extractDocs(changes);
    changes = getUserNames(changes);
    changes = removeDatabaseProperties(changes);

    // Replace original docs with changed docs
    changes.map(function (changedUser) {

      var originalUserIndex = _.findIndex(
        allUsers,
        function (user) { return changedUser.name.id == user.name.id; });

      // User exists, update data
      if (originalUserIndex > -1) {
        allUsers[originalUserIndex] = changedUser;

      // New user, add to all users
      } else {
        allUsers.push(changedUser);
      }
    });

    return outputUsers(allUsers);
  };

  /**
   * Extract docs
   * @param {array}  metaDocs Contains metaDocs
   * @return {array}          Contains docs
   */
  function extractDocs(metaDocs) {
    return metaDocs.map(function (metaDoc) {
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
   * Filter users into recent, new, and frequent categories
   * @param {array} allUsers Contains user docs
   */
  function filterUsers(allUsers) {
    var orderBy = $filter('orderBy');
    return {
      "recent": orderBy(allUsers,
        function (user) { return new Date(user.lastLogin); },
        true),
      "new": orderBy(allUsers,
        function (user) { return new Date(user.firstLogin); },
        true),
      "frequent": orderBy(allUsers, 'totalLogins', true)
    };
  }

  /**
   * Output users in required format
   * @param {array} allUsers Contains user docs
   * @return {object}        Contains all users (array), filtered users
   *                         (object), and total users (number)
   */
  function outputUsers(allUsers) {
    return {
      "all": allUsers,
      "filtered": filterUsers(allUsers),
      "total": allUsers.length
    };
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
