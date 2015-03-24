app.service('NotificationService', ['$document', '$window', '$interval', '$timeout', 'DatabaseFactory', function ($document, $window, $interval, $timeout, DatabaseFactory) {

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
  this.flashTitle = function (title) {

    var oldPageTitle = "Dashboard | GoCo Student",
        newPageTitle = "Hey look!",
        flashTime = 750, // in milliseconds
        numOfFlashes = 1; // total toggles back and forth

    // Use parameter if provided
    if (title) newPagetitle = title;

    $interval(
      function () { togglePageTitle(oldPageTitle, newPageTitle); },
      flashTime,
      numOfFlashes * 2
    );
  };

  /**
   * Request permission to show desktop notifications
   * Logs error if notifications are not supported in browser
   */
  this.requestDesktopPermission = function () {

    // Check for notifications support
    if (!$window.Notification) {
      console.error(errorMessage);
      return;
    } else {
      if ($window.Notification.permission !== "granted") {
        $window.Notification.requestPermission();
      }
    }
  };

  /**
   * Create a desktop notification
   * @param {String} body  Body of notification (optional)
   * @param {String} title Title of notification (optional)
   */
  this.notifyDesktop = function (body, title) {

    var notifTime = 3500, // Time to display in milliseconds
        iconPath = "/img/favicon-192.png",
        notifTitle = "GoCo Student Dashboard",
        notifBody = "You have a new notification on the GoCo Student Dashboard!";

    // Use parameters if provided
    if (body) notifBody = body;
    if (title) notifTitle = title;

    // Create notification
    var notification = new Notification(notifTitle, {
      icon: iconPath,
      body: notifBody
    });

    // Close notification after set amount of time
    $timeout(function () {
      notification.close();
    }, notifTime);
  };
}]);
