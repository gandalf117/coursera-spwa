(function () {
	'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownControllerFunc)
	.service('MenuSearchService', MenuSearchServiceFunc)
	.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com');

	NarrowItDownControllerFunc.$inject = ['$scope', 'MenuSearchService'];
	
	function NarrowItDownControllerFunc($scope, service){
		
		
		var item = this;
		
		item.search_key = '';
		
		item.found = [];
		
		item.findBtnHandler = function() {
			
			if(item.search_key) {
				
				var promise = service.getMatchedMenuItems(item.search_key);
			
				promise.then(function (response) {
				
					item.found = response;
					
					console.log( item.found );
				
				});
			
			}
			
		}
		
	}
	
	
	MenuSearchServiceFunc.$inject = ['$http', 'ApiBasePath'];
	
	function MenuSearchServiceFunc($http, ApiBasePath){
		
		var service = this;
		
		var items = [];
		
		service.getMatchedMenuItems = function(searchTerm) {
			
			return $http({
				
				method: 'GET',
				url: (ApiBasePath + '/menu_items.json')
				
			}).then(function (response) {
					
				items = [];
				
				for(var i in response.data.menu_items) {
					
					if(response.data.menu_items[i].description.search(searchTerm) >= 0) {
						
						items.push(response.data.menu_items[i]);
						
					}
					
				}
				
				return items;
				
			}).catch(function (error) {
			  
				console.log(error);
			
			});
			
		};
		
	}
	
	
})();
