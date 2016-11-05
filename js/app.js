var app = angular.module('gocostudent-dashboard', []);

app.constant('DatabaseConstant', {
  'url': 'https://adamvig.cloudant.com',
  'username': 'ressiblythenahightedgers',
  'password': 'W4LnuQ6uJpkioDRk5Pnvvoms'
})
.constant('BackendConstant', {
  'url': 'https://gocostudent.adamvig.com/api/',
  'username': '',
  'password': ''
})
.constant('LogsConstant', {
  'url': 'https://papertrailapp.com/systems/GoCo-API-Legacy/events',
  'apiURL': 'https://papertrailapp.com/api/v1/',
  'token': 'aDaDyb4E2vu3deKfdo9G'
});
