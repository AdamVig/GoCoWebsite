app.service('RefreshService', ['$document', '$interval', 'DatabaseFactory', function ($document, $interval, DatabaseFactory) {

  /**
   * Get title of page
   */
  function getPageTitle() {
    return $document[0].title;
  }

  /**
   * Change page title
   * @param {String} title New page title
   */
  function changePageTitle(title) {
    $document[0].title = title;
  }

  /**
   * Toggle between two page titles
   * @param {String} oldPageTitle Old title of page
   * @param {String} newPageTitle New title of page
   */
  function togglePageTitle(oldPageTitle, newPageTitle) {
    if (getPageTitle() == oldPageTitle) {
      changePageTitle(newPageTitle);
    } else {
      changePageTitle(oldPageTitle);
    }
  }

  /**
   * Flash title of page
   */
  this.flashTitle = function () {

    var oldPageTitle = "Dashboard | GoCo Student",
        newPageTitle = "Hey look!",
        flashTime = 750, // in milliseconds
        numOfFlashes = 1; // total toggles back and forth

    $interval(
      function () { togglePageTitle(oldPageTitle, newPageTitle); },
      flashTime,
      numOfFlashes * 2
    );
  };

}]);
