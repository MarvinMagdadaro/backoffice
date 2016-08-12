angular.module('App')
    .controller('UserController', ['$location', '$scope', '$rootScope', 'UserService', 'ModalService', 'AlertService', 'FlashMessage',   
function UserController($location, $scope, $rootScope, UserService, ModalService, AlertService, FlashMessage) {
	var self = this;
    self.user={id:null,displayName:'',email:'',role:[{id:null,rolename:'',roledesc:''}]};
	self.users=[];
	$scope.currentPage = 1;
	$scope.itemsPerPage = 1;
   	$scope.maxSize = 5;

    self.reset = function(){
    	//self.user={id:null,displayName:'',email:''};
        self.user={id:null,displayName:'',email:'',role:[{id:null,rolename:'',roledesc:''}]};
        $scope.myForm.$setPristine(); //reset Form
    };
    
    self.fetchAllUsers = function(){
    	UserService.fetchAllUsers()
    	.then(
			function(d) {
				self.users = d;
			},
			function(errResponse){
				AlertService.add('danger', 'Error while fetching Users.');
			}
    	);
    };
    
    self.createUser = function(user){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Add User',
                headerText: 'Add ' + user.displayName + '?',
                bodyText: 'Are you sure you want to add this user?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
	    	UserService.createUser(user)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllUsers();	
            		  AlertService.add('success', 'User added successfully.');
	              },	
	              function(errResponse){
		               AlertService.add('danger', 'Error while adding User.');
	              }	
            );
        });
    };
    
    self.updateUser = function(user, id){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Update User',
                headerText: 'Update ' + user.displayName + '?',
                bodyText: 'Are you sure you want to update this user?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
	        UserService.updateUser(user, id)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllUsers();	
            		  AlertService.add('success', 'User updated successfully.');
	              },	
	              function(errResponse){
		               AlertService.add('danger', 'Error while updating User.');
	              }	
            );
        });
    };

    self.deleteUser = function(user){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete User',
                headerText: 'Delete ' + user.displayName + '?',
                bodyText: 'Are you sure you want to delete this user?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
	    	UserService.deleteUser(user.id)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllUsers();	
            		  AlertService.add('success', 'User deleted successfully.');
	              },	
	              function(errResponse){
		               AlertService.add('danger', 'Error while deleting User.');
	              }	
            );
        });
    };

    self.fetchAllUsers();

    self.submit = function() {
        if(self.user.id==null){
            self.createUser(self.user);
        }else{
        	self.updateUser(self.user, self.user.id);
        }
    };
        
    self.edit = function(id){
        for(var i = 0; i < self.users.length; i++){
            if(self.users[i].id == id) {
                self.user = angular.copy(self.users[i]);
               break;
            }
        }
    };
        
    self.remove = function(user){
        self.deleteUser(user);
    };

    self.cancel = function(){
        self.reset();
        self.fetchAllUsers();
    };
    
}]);