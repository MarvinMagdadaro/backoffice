angular.module('App')
    .controller('AppController', AppController);

AppController.$inject = ['$location', '$scope', '$rootScope', 'AuthService', 'FlashMessage'];
function AppController($location, $scope, $rootScope, AuthService, FlashMessage) {
    var app = this;

    app.logout = function () {
        console.log('received the logout event for user: '+$scope.currentUser.email);
        AuthService.logout(function (response) {
            AuthService.clearCredentials();
            $location.path('/');
        });
    };
};
