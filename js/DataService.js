app.service('DataService', [function () {

  /**
   * Extract docs
   * @param {object} response CouchDB _all_docs object
   * @return {array}          Contains docs
   */
  this.extractDocs = function (response) {
    return response.data.rows.map(function (metaDoc) {
      return metaDoc.doc;
    });
  };

  /**
   * Remove non-user docs, get full name, and remove CouchDB properties
   * @param {array} allUsers List of all users
   * @return {array}         List of all users
   */
  this.cleanUsers = function (allUsers) {
    return allUsers.filter(function (doc) {
      if (doc._id.indexOf('.') > -1) {
        return doc;
      }
    }).map(function (user) {

      // Get name from firstname.lastname format
      var nameSplit = user._id.split('.');
      user.name = {
        "first": capitalizeFirstLetter(nameSplit[0]),
        "last": capitalizeFirstLetter(nameSplit[1]),
        "id": user._id
      };
      user.name.full = user.name.first + " " + user.name.last;

      // Clear CouchDB properties
      delete user._id;
      delete user._rev;

      return user;
    });
  };

  /**
   * Capitalize first letter of a string
   * @param {String}  string String to capitalize
   * @return {String}        Capitalized string
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}]);
