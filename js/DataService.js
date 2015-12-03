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

    allUsers = removeInactiveUsers(allUsers);
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

    allUsers = removeChangedProperty(allUsers);

    // Process changed docs
    changes = extractDocs(changes);
    changes = removeNonUserDocs(changes);
    changes = getUserNames(changes);
    changes = removeDatabaseProperties(changes);

    // Replace original docs with changed docs
    changes.map(function (changedUser) {

      changedUser.changed = true;
      var originalUserIndex = findUserIndex(changedUser, allUsers);

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
   * Get app info doc from alldocs response
   * @param {object} response Contains data, status, etc.
   * @return {object}         App info doc containing school population, etc.
   */
  this.getAppInfo = function (response) {
    return extractDocs(response.data.rows).filter(function (doc) {
      return doc._id == 'info';
    })[0];
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
   * Tests for the existence of a period ('.') in _id of docs
   * @param {array} allDocs Contains doc objects
   * @return {array}        Contains only user doc objects
   */
  function removeNonUserDocs (allDocs) {
    return allDocs.filter(function (doc) {
      // Filter out any docs without a period ('.') in their _id
      return _.contains(doc._id, '.');
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

      // If the doc _id has a first and last name
      if (nameSplit.length == 2) {
        user.name = {
          "first": capitalizeFirstLetter(nameSplit[0]),
          "last": capitalizeFirstLetter(nameSplit[1]),
          "id": user._id
        };
        user.name.full = user.name.first + " " + user.name.last;
        return user;
      } else {
        throw "Error in getUserNames(): " +
              "Cannot get user name from document '" + user._id + "'.";
      }
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
   * Remove inactive users from all users
   * @param {array} allUsers Contains user docs
   */
  function removeInactiveUsers(allUsers) {
    return allUsers.filter(function (user) { return user.active; });
  }

  /**
   * Remove property 'changed' from all users
   * @param {array} allUsers Contains user objects
   */
  function removeChangedProperty(allUsers) {
    return allUsers.map(function (user) {
      delete user.changed;
      return user;
    });
  }

  /**
   * Extract names from all users
   * @param {array} allUsers Contains user objects
   * @return {array}         Contains names of all users as strings
   */
  function extractNames(allUsers) {
    return allUsers.map(function (user) {
      return user.name.full;
    });
  }

  /**
   * Sort users in recent, new, and frequent categories
   * @param {array} allUsers Contains user docs
   */
  function sortUsers(allUsers) {
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
   *                         (object), percentage of school (number)and
   *                         total users (number)
   */
  function outputUsers(allUsers) {

    var totalUsers = allUsers.length;

    return {
      "all": allUsers,
      "names": extractNames(allUsers),
      "filtered": sortUsers(allUsers),
      "total": totalUsers
    };
  }

  /**
   * Capitalize first letter of a string
   * @param {String}  string String to capitalize
   * @return {String}        Capitalized string
   */
  function capitalizeFirstLetter(string) {
    if (string.length > 0) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return string;
    }

  }

  /**
   * Find index of user in array of users
   * @param {object} user Contains name.id
   * @param {array} users Contains user objects
   */
  function findUserIndex(user, users) {
    return _.findIndex(
      users,
      function (u) { return user.name.id == u.name.id; }
    );
  }

}]);
