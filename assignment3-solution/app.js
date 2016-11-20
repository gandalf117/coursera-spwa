(function () {
	'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownControllerFunc)
	.service('MenuSearchService', MenuSearchServiceFunc)
	.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com')
	.directive('foundItems', FoundItemsDirective);

	function FoundItemsDirective() {
		
		var ddo = {
			templateUrl: 'foundList.html',
			scope: {
				items: '<itemsFound',
				title: '@',
				onRemove: '&'
			},
			controller: NarrowItDownDirectiveController,
			controllerAs: 'curr',
			bindToController: true
		};

		return ddo;
	
	}	
	
	function NarrowItDownDirectiveController() {}
	
	NarrowItDownControllerFunc.$inject = ['$scope', 'MenuSearchService'];
	
	function NarrowItDownControllerFunc($scope, service){
		
		
		var slf = this;
		
		slf.search_key = '';
		
		slf.found = [];
		
		slf.title = '';
		
		slf.findBtnHandler = function() {
			
			if(slf.search_key) {
				
				var promise = service.getMatchedMenuItems(slf.search_key);
			
				promise.then(function (response) {
				
					slf.found = response;
					
					slf.title = 'The list of found items contains: ' + slf.found.length + ' items';
					
					console.log( slf.found );
				
				});
			
			}
			
		}
		
		slf.removeItem = function (itemIndex) {
			
			slf.found.splice(itemIndex, 1);
			
			slf.title = 'The list of found items contains: ' + slf.found.length + ' items';
			
		};		
		
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
