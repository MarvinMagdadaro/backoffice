angular.module('App')
    .controller('PermissionController', ['$location', '$scope', '$rootScope', 'PermissionService', 'ModalService', 'AlertService', 'FlashMessage',   
function PermissionController($location, $scope, $rootScope, PermissionService, ModalService, AlertService, FlashMessage) {
	var self = this;
	self.groups=[{'groupname':'System and Security'},
	             {'groupname':'Brands'},
	             {'groupname':'Scratchcards'}];
	self.categories=[{'groupname':'System and Security','catname':'User Management'},
	                 {'groupname':'System and Security','catname':'Role Management'},
	                 {'groupname':'System and Security','catname':'Permission Management'},
	                 {'groupname':'Brands','catname':'Brand A'},
	                 {'groupname':'Brands','catname':'Brand B'},
	                 {'groupname':'Brands','catname':'Brand C'},
	                 {'groupname':'Brands','catname':'Brand D'},
	                 {'groupname':'Brands','catname':'Brand E'},
	                 {'groupname':'Scratchcards','catname':'Model'},
	                 {'groupname':'Scratchcards','catname':'Lottery'},
	                 {'groupname':'Scratchcards','catname':'Stream'},
	                 {'groupname':'Scratchcards','catname':'Batch'}];
	self.rightslist=[{'rightsname':'Create'},
	                 {'rightsname':'Read'},
	                 {'rightsname':'Update'},
	                 {'rightsname':'Delete'}];
    self.permission={id:null,permissionname:'',permissiondesc:'',group:'',category:'',rights:''};
	self.permissions=[];
	$scope.VALID_PATTERN = '^[A-Z0-9_]+$';
	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;
   	$scope.maxSize = 5;

    self.reset = function(){
        self.permission={id:null,permissionname:'',permissiondesc:'',group:'',category:'',rights:''};
        $scope.myForm.$setPristine(); //reset Form
    };
    
    self.fetchAllPermissions = function(){
    	PermissionService.fetchAllPermissions()
    	.then(
			function(d) {
				self.permissions = d;
			},
			function(errResponse){
				AlertService.add('danger', 'Error while fetching Permissions.');
			}
    	);
    };
    
    self.createPermission = function(permission){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Add Permission',
                headerText: 'Add ' + permission.permissionname + '?',
                bodyText: 'Are you sure you want to add this permission?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
	    	PermissionService.createPermission(permission)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllPermissions();	
            		  AlertService.add('success', 'Permission added successfully.');
	              },	
	              function(errResponse){
	            	  if (errResponse.status==409){
	            		  AlertService.add('danger', 'Permission Name '+ permission.permissionname +' already exists.');
	            	  } else{
	            		  AlertService.add('danger', 'Error while adding Permission.');
	            	  }
	              }	
            );
        });
    };
    
    self.updatePermission = function(permission, id){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Update Permission',
                headerText: 'Update ' + permission.permissionname + '?',
                bodyText: 'Are you sure you want to update this permission?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
	        PermissionService.updatePermission(permission, id)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllPermissions();	
            		  AlertService.add('success', 'Permission updated successfully.');
	              },	
	              function(errResponse){
		               AlertService.add('danger', 'Error while updating Permission.');
	              }	
            );
        });
    };

    self.deletePermission = function(permission){
        var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Permission',
                headerText: 'Delete ' + permission.permissionname + '?',
                bodyText: 'Are you sure you want to delete this permission?'
            };
    	
        ModalService.showModal({}, modalOptions).then(function (result) {
	    	PermissionService.deletePermission(permission.id)
              .then(
        		  function(d){
    				  self.reset();
            		  self.fetchAllPermissions();	
            		  AlertService.add('success', 'Permission deleted successfully.');
	              },	
	              function(errResponse){
		               AlertService.add('danger', 'Error while deleting Permission.');
	              }	
            );
        });
    };

    self.fetchAllPermissions();

    self.submit = function() {
        if(self.permission.id==null){
            self.createPermission(self.permission);
        }else{
        	self.updatePermission(self.permission, self.permission.id);
        }
    };
        
    self.edit = function(id){
        for(var i = 0; i < self.permissions.length; i++){
            if(self.permissions[i].id == id) {
                self.permission = angular.copy(self.permissions[i]);
                break;
            }
        }
    };
        
    self.remove = function(permission){
        self.deletePermission(permission);
    };

    self.cancel = function(){
    	self.reset();
        self.fetchAllPermissions();
    };
    
}]);