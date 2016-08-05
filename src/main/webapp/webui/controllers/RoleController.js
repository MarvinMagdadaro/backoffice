angular.module('App')
    .controller('RoleController', ['$location', '$scope', '$rootScope', 'RoleService', 'ModalService', 'AlertService', 'FlashMessage',   
function RoleController($location, $scope, $rootScope, RoleService, ModalService, AlertService, FlashMessage) {
	var self = this;
    self.role={id:null,rolename:'',roledesc:''};
	self.roles=[];
	self.selectedItem;
	
	self.dropboxitemselected = function (item) {
 		self.selectedItem = item;
        alert(self.selectedItem);
    };
    
    self.reset = function(){
    	self.role={id:null,rolename:'',roledesc:''};
        $scope.myForm.$setPristine(); //reset Form
    };
    
    self.fetchAllRoles = function(){
    	RoleService.fetchAllRoles()
    	.then(
			function(d) {
				self.roles = d;
			},
			function(errResponse){
				AlertService.add('danger', 'Error while fetching Roles.');
			}
    	);
    };
    
    self.createRole = function(role){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Add Role',
                headerText: 'Add ' + role.rolename + '?',
                bodyText: 'Are you sure you want to add this role?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
        	RoleService.createRole(role)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllRoles();	
            		  AlertService.add('success', 'Role added successfully.');
	              },	
        		  function(errResponse){
    				  AlertService.add('danger', 'Error while adding Role.');
	              }	
            );
        });
    	
    };
    
    self.updateRole = function(role, id){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Update Role',
                headerText: 'Update ' + role.rolename + '?',
                bodyText: 'Are you sure you want to update this role?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
	        RoleService.updateRole(role, id)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllRoles();	
            		  AlertService.add('success', 'Role updated successfully.');
	              },	
        		  function(errResponse){
    				  AlertService.add('danger', 'Error while updating Role.');
	              }	
            );
        });
    };

    self.deleteRole = function(role){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Role',
                headerText: 'Delete ' + role.rolename + '?',
                bodyText: 'Are you sure you want to delete this role?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
	    	RoleService.deleteRole(role.id)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllRoles();	
            		  AlertService.add('success', 'Role deleted successfully.');
	              },	
        		  function(errResponse){
    				  AlertService.add('danger', 'Error while deleting Role.');
	              }	
            );
        });
    };

    self.fetchAllRoles();

    self.submit = function() {
        if(self.role.id==null){
            self.createRole(self.role);
        }else{
        	self.updateRole(self.role, self.role.id);
        }
    };
        
    self.edit = function(id){
        for(var i = 0; i < self.roles.length; i++){
            if(self.roles[i].id == id) {
                self.role = angular.copy(self.roles[i]);
               break;
            }
        }
    };
        
    self.remove = function(role){
        self.deleteRole(role);
    };

    self.cancel = function(){
    	self.reset();
        self.fetchAllRoles();
    };
    
}]);