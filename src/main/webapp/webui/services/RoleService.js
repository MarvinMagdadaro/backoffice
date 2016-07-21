'use strict';
angular.module('App').
	factory('RoleService',['$http', '$q', 'BackendCfg', function($http, $q, BackendCfg){

	return {
		
			fetchAllRoles: function() {
					return $http.get(BackendCfg.url+'/api/role/list/')
							.then(
									function(response){
										return response.data;
									}, 
									function(errResponse){
										console.error('Error while fetching roles');
										return $q.reject(errResponse);
									}
							);
			},
		    
		    createRole: function(role){
					return $http.post(BackendCfg.url+'/api/role/add/', role)
							.then(
									function(response){
										return response.data;
									}, 
									function(errResponse){
										console.error('Error while creating role');
										return $q.reject(errResponse);
									}
							);
		    },
		    
		    updateRole: function(role, id){
					return $http.put(BackendCfg.url+'/api/role/edit/'+id, role)
							.then(
									function(response){
										return response.data;
									}, 
									function(errResponse){
										console.error('Error while updating role');
										return $q.reject(errResponse);
									}
							);
			},
		    
			deleteRole: function(id){
					return $http.delete(BackendCfg.url+'/api/role/delete/'+id)
							.then(
									function(response){
										return response.data;
									}, 
									function(errResponse){
										console.error('Error while deleting role');
										return $q.reject(errResponse);
									}
							);
			}
		
	};

}]);