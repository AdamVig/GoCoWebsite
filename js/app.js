var app = angular.module('gocostudent-dashboard', []);

app.constant('DatabaseConstant', {
  'url': 'https://adamvig.cloudant.com',
  'username': 'ressiblythenahightedgers',
  'password': 'W4LnuQ6uJpkioDRk5Pnvvoms'
})
.constant('BackendConstant', {
  'url': 'http://local.dev:5000/gocostudent/2.4/',
  'username': '',
  'password': ''
})
.constant('LogsConstant', {
  'url': 'https://papertrailapp.com/systems/AdamVigAPI/events',
  'apiURL': 'https://papertrailapp.com/api/v1/',
  'token': 'aDaDyb4E2vu3deKfdo9G'
});
