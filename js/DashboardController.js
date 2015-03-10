app.controller('DashboardController', ['$filter', 'DatabaseFactory', 'DataService', function ($filter, DatabaseFactory, DataService) {

  var dashboard = this;
  dashboard.usersToDisplay = 10;

  // Get current banner
  DatabaseFactory.get('message').then(function (response) {
    dashboard.banner = response.data;
  });

  // Get all users
  DatabaseFactory.getAll().then(function (response) {

    dashboard.allUsers = DataService.extractDocs(response);
    dashboard.allUsers = DataService.cleanUsers(dashboard.allUsers);
    dashboard.totalUsers = dashboard.allUsers.length;
    dashboard.users = {
      'recent': $filter('orderBy')(dashboard.allUsers, 'lastLogin', true),
      'frequent': $filter('orderBy')(dashboard.allUsers, 'totalLogins', true),
      'new': $filter('orderBy')(dashboard.allUsers, 'firstLogin', true)
    };
  });

}]);
