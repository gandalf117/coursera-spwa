(function () {
	'use strict';

	angular.module('LunchCheck', [])
	.controller('LunchCheckController', LunchController);

	LunchController.$inject = ['$scope'];

	function LunchController($scope) {
		
		$scope.csv_list = null;
		
		$scope.msg = '';
		
		$scope.msg_note = '';
		
		$scope.checkList = function () {
			
			var list = $scope.csv_list;
			
			var status = true;
			
			var list_arr = [];
			
			//reset messages
			$scope.msg = '';
			$scope.msg_note = '';
			
			//check if the list exists
			
			if(list) {
				
				//make an array out of the list
				
				list_arr = list.split(',');
				
				//loop through it to find if there is an empty item
				
				for(var i in list_arr) {
					
					//if the item is empty change the status
					if(!list_arr[i].trim()) { 
					
						status = false;
					
						//remove one item from the list so the count would be correct
						list_arr.pop();
						
					}
					
				}
				
				//set the proper messages based on the status and array length
				
				if(list_arr.length <= 3) { setMessage(3); }
					
				else { setMessage(4); }
					
				if(!status) { setMessage(2); }
			
			} else {
				
				setMessage(1);
				
			}
			
		};
		
		function setMessage(num) {
			
			if(num == 1) { $scope.msg = 'Please enter data first.'; }
			
			else if(num == 2) { $scope.msg_note = '(You have an empty item in the list. Such items are not included in the count.)'; }
			
			else if(num == 3) { $scope.msg = 'Enjoy!'; }
			
			else if(num == 4) { $scope.msg = 'Too much!'; }
			
		}
		
	}

})();
