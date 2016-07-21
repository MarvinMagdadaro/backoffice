angular.module('App')
    .controller('RoleController', ['$location', '$scope', '$rootScope', 'RoleService', 'FlashMessage',   
function RoleController($location, $scope, $rootScope, RoleService, FlashMessage) {
	var self = this;
    self.role={id:null,rolename:''};
	self.roles=[];
	self.selectedItem;
	
	self.dropboxitemselected = function (item) {
 		self.selectedItem = item;
        alert(self.selectedItem);
    };
    
    self.fetchAllRoles = function(){
    	RoleService.fetchAllRoles()
    	.then(
    			function(d) {
    				self.roles = d;
    			},
    			function(errResponse){
    				console.error('Error while fetching Roles');
    			}
    	);
    };
    
    self.createRole = function(role){
    	console.log('AppControl create role ',role);
    	RoleService.createRole(role)
	              .then(
	            		  self.fetchAllRoles, 
			              function(errResponse){
				               console.error('Error while creating Role.');
			              }	
            );
    };
    
    self.updateRole = function(role, id){
        RoleService.updateRole(role, id)
	              .then(
	            		  self.fetchAllRoles, 
			              function(errResponse){
				               console.error('Error while updating Role.');
			              }	
            );
    };

    self.deleteRole = function(id){
    	RoleService.deleteRole(id)
	              .then(
	            		  self.fetchAllRoles, 
			              function(errResponse){
				               console.error('Error while deleting Role.');
			              }	
            );
    };

    self.fetchAllRoles();

    self.submit = function() {
        if(self.role.id==null){
            console.log('Saving New Role', self.role);    
            self.createRole(self.role);
        }else{
        	self.updateRole(self.role, self.role.id);
            console.log('Role updated with id ', self.role.id);
        }
        self.reset();
    };
        
    self.edit = function(id){
        console.log('id to be edited', id);
        for(var i = 0; i < self.roles.length; i++){
            if(self.roles[i].id == id) {
                self.role = angular.copy(self.roles[i]);
               break;
            }
        }
    };
        
    self.remove = function(id){
        console.log('id to be deleted', id);
        if(self.role.id == id) {//clean form if the role to be deleted is shown there.
        	self.reset();
        }
        self.deleteRole(id);
    };

    
    self.reset = function(){
    	self.role={id:null,rolename:''};
        $scope.myForm.$setPristine(); //reset Form
    };
    
}]);