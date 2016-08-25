angular.module('App')
    .controller('UserController', ['$location', '$scope', '$rootScope', 'UserService', 'ModalService', 'AlertService', 'FlashMessage', '$anchorScroll',   
function UserController($location, $scope, $rootScope, UserService, ModalService, AlertService, FlashMessage, $anchorScroll) {
	var self = this;
    self.user={id:null,displayName:'',email:'',role:{id:null,rolename:'',roledesc:''}};
	self.users=[];
	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;
   	$scope.maxSize = 5;

    self.reset = function(){
    	//self.user={id:null,displayName:'',email:''};
        self.user={id:null,displayName:'',email:'',role:{id:null,rolename:'',roledesc:''}};
        if ($scope.myForm) $scope.myForm.$setPristine(); //reset Form
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
                headerText: 'Add User?',
                bodyText: {'User Name':user.displayName,'Email':user.email,'Role':user.role.roledesc}
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
        	$anchorScroll();
	    	UserService.createUser(user)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllUsers();	
            		  AlertService.add('success', 'User added successfully.');
	              },	
	              function(errResponse){
	            	  if (errResponse.status==409){
	            		  AlertService.add('danger', 'User email '+ user.email +' already exists.');
	            	  } else{
	    				  AlertService.add('danger', 'Error while adding User.');
	            	  }
	              }	
            );
        });
    };
    
    self.updateUser = function(user, id){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Update User',
                headerText: 'Update User?',
                bodyText: {'User Name':user.displayName,'Email':user.email,'Role':user.role.roledesc}
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
        	$anchorScroll();
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
                headerText: 'Delete User?',
                bodyText: {'User Name':user.displayName,'Email':user.email,'Role':user.role.roledesc}
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
        	$anchorScroll();
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