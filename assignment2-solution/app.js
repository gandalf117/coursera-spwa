(function () {
	'use strict';

	angular.module('ShoppingListCheckOff', [])
	.controller('MsgController', MsgControllerFunc)
	.controller('ToBuyController', ToBuyControllerFunc)
	.controller('AlreadyBoughtController', AlreadyBoughtControllerFunc)
	.service('ShoppingListCheckOffService', ShoppingListService);

	//controller parent - implemented to hanlde the messages, because my messages are a bit crazy (I have done this as a bonus feature)
	//all the messages are updated on the parent scope - this way both messages can be updated by one controller at a time
	
	MsgControllerFunc.$inject = ['$scope'];

	function MsgControllerFunc($scope) {
		
		$scope.pc = this;
		$scope.pc.msg1 = false;
		$scope.pc.msg2 = true;
		
	};
	
	//controller 1 - handles items which are not bought yet as well as adding and removing
	
	ToBuyControllerFunc.$inject = ['$scope', 'ShoppingListCheckOffService'];

	function ToBuyControllerFunc($scope, ShoppingService) {
		
		var list = this;

		list.name = '';
		
		list.quantity = '';
		
		list.items = ShoppingService.getToBuyItems();
		
		list.addItem = function() {
			
			//adds an item only if the name and quantity are specified
			if(list.name && list.quantity) {
				
				ShoppingService.addItem(list.name, list.quantity);
				
				updateMsg();
				
			}
			
		};
		
		
		list.removeItem = function() {
			
			//removes an item for a certain name only if the name is specified
			if(list.name && list.quantity) {
				
				ShoppingService.removeItem(list.name);
				
				updateMsg();
				
			}
			
		};
		
		list.buyItem = function(itemIndex) {
			
			ShoppingService.addBoughtItem(itemIndex);
			
			updateMsg();
			
		};
		
		function updateMsg() {
			
			$scope.pc.msg1 = ShoppingService.getToBuyMsg();
			$scope.pc.msg2 = ShoppingService.getBoughtMsg();
			
		}
		
	}
	
	//controller 2 - handles items which are bought
	
	AlreadyBoughtControllerFunc.$inject = ['$scope', 'ShoppingListCheckOffService'];
	
	function AlreadyBoughtControllerFunc($scope, ShoppingService) {
		
		var list = this;

		list.items = ShoppingService.getBoughtItems();

		list.msg = ShoppingService.getBoughtMsg();
		
		list.returnItem = function(itemIndex) {
			
			ShoppingService.addToBuyItem(itemIndex);
			
			updateMsg();
			
		};
		
		function updateMsg() {
			
			$scope.pc.msg1 = ShoppingService.getToBuyMsg();
			$scope.pc.msg2 = ShoppingService.getBoughtMsg();
			
		}
		
	}
	
	//the crazy service
	
	function ShoppingListService() {
		
		var service = this;

		// List of shopping items
		var to_buy_items = [];
		var bought_items = [];
		
		//initialize to_buy_items array with some data
		to_buy_items = [ {name: 'Eggs', quantity: 5}, 
						{name: 'Bread', quantity: 1},
						{name: 'Cheese', quantity: '0.5 kg'},
						{name: 'Peppers', quantity: '0.2 kg'},
						{name: 'Olive Oil', quantity: 1} ];
		
		//this function removes an item with a specific index from the to_buy_items array and adds it to the bought_items array
		service.addBoughtItem = function (itemIdex) {
			
			//splice removes the item and returns it as an array
			var item = to_buy_items.splice(itemIdex, 1);
			
			//add the removed array item (which has only one element) to the bought_items array
			bought_items.push(item[0]);
			
		};
		
		//this is the opposite of addBoughtItem function but not like an evil version it is just that the arrays are switched
		service.addToBuyItem = function (itemIdex) {
			
			//splice removes the item and returns it as an array
			var item = bought_items.splice(itemIdex, 1);
			
			//add the removed array item (which has only one element) to the to_buy_items array
			to_buy_items.push(item[0]);
			
		};
		
		//returns all the items that should be bought
		service.getToBuyItems = function () {
			return to_buy_items;
		};
		
		//returns all the bought items
		service.getBoughtItems = function () {
			return bought_items;
		};
		
		//returns true or false based on how many items are in the to_buy_items array
		service.getToBuyMsg = function () {
			
			return to_buy_items.length > 0 ? false : true;
			
		}
		
		//returns true or false based on how many items are in the bought_items array
		//getBoughtMsg - Msg is not morally corrupted, that is just its name :)
		service.getBoughtMsg = function () {
			
			return bought_items.length > 0 ? false : true;
			
		}		
		
		//************************************************************************************
		//my custom BONUS features... I got a bit carried away
		//************************************************************************************
		
		//adds an item to the to_buy array
		service.addItem = function (itemN, itemQ) {
			
			to_buy_items.push( { name: itemN, quantity: itemQ } );
		
		};
		
		//removes an item(s) from either list by matching its name
		service.removeItem = function (itemN) {
			
			//search and remove from the to buy items array
			for(var i=0; i<to_buy_items.length; i++) {
				
				if(to_buy_items[i].name == itemN) {
					
					to_buy_items.splice(i, 1);
					return;
					
				}
				
			}
			
			//search and remove from the bought items array
			for(var i=0; i<bought_items.length; i++) {
				
				if(bought_items[i].name == itemN) {
					
					bought_items.splice(i, 1);
					return;
					
				}
				
			}
			
		};
		
	}
	
})();
