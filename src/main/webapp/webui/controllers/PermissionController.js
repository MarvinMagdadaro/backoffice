angular.module('App')
    .controller('PermissionController', ['$location', '$scope', '$rootScope', 'PermissionService', 'FlashMessage',   
function PermissionController($location, $scope, $rootScope, PermissionService, FlashMessage) {
	var self = this;
    self.permission={id:null,permissionname:''};
	self.permissions=[];

    self.fetchAllPermissions = function(){
    	PermissionService.fetchAllPermissions()
    	.then(
    			function(d) {
    				self.permissions = d;
    			},
    			function(errResponse){
    				console.error('Error while fetching Permissions');
    			}
    	);
    };
    
    self.createPermission = function(permission){
    	console.log('AppControl create permission ',permission);
    	PermissionService.createPermission(permission)
	              .then(
	            		  self.fetchAllPermissions, 
			              function(errResponse){
				               console.error('Error while creating Permission.');
			              }	
            );
    };
    
    self.updatePermission = function(permission, id){
        PermissionService.updatePermission(permission, id)
	              .then(
	            		  self.fetchAllPermissions, 
			              function(errResponse){
				               console.error('Error while updating Permission.');
			              }	
            );
    };

    self.deletePermission = function(id){
    	PermissionService.deletePermission(id)
	              .then(
	            		  self.fetchAllPermissions, 
			              function(errResponse){
				               console.error('Error while deleting Permission.');
			              }	
            );
    };

    self.fetchAllPermissions();

    self.submit = function() {
        if(self.permission.id==null){
            console.log('Saving New Permission', self.permission);    
            self.createPermission(self.permission);
        }else{
        	self.updatePermission(self.permission, self.permission.id);
            console.log('Permission updated with id ', self.permission.id);
        }
        self.reset();
    };
        
    self.edit = function(id){
        console.log('id to be edited', id);
        for(var i = 0; i < self.permissions.length; i++){
            if(self.permissions[i].id == id) {
                self.permission = angular.copy(self.permissions[i]);
               break;
            }
        }
    };
        
    self.remove = function(id){
        console.log('id to be deleted', id);
        if(self.permission.id == id) {//clean form if the permission to be deleted is shown there.
        	self.reset();
        }
        self.deletePermission(id);
    };

    
    self.reset = function(){
    	self.permission={id:null,permissionname:''};
        $scope.myForm.$setPristine(); //reset Form
    };
    
}]);