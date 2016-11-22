(function() {
	'use strict';
	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.directive('liItem', LiItem)
	.directive('foundItems', FoundItems)
	.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

	function FoundItems() {
  		var ddo = {
	    templateUrl: 'foundItems.html',
	    scope: {
	    	foundIt: '<',
	    	onRemove: '&',
	    	},
	    controller: FoundItemsController,
	    bindToController: true,
	    controllerAs: 'dirCtrl'
	    };
  		return ddo;
  	}

  	function FoundItemsController() {
		var list = this;
		list.empty = function() {
			if (list.foundIt == undefined) {
				return false;				
			}
			return (list.foundIt.length == 0) 		
		}
	}

	function LiItem() {
		var ddo = {
			template: '{{ item.name }}, {{item.short_name}}, {{item.description}}'

		};
		return ddo;
	}

	

	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService) {

		var ctrl = this;		
		var promise;
		ctrl.searchTerm = '';
		ctrl.found = undefined;

		ctrl.GetSearchTerm = function() {
			promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
			promise.then(function(response) {
				ctrl.found = response;
				//console.log(ctrl.found);				
			})
			.catch (function(error) {
				console.log(error.status)
			});
			
		}

		ctrl.RemoveIt = function(index) {
			ctrl.found.splice(index, 1);
		}
	}

	MenuSearchService.$inject = ['$http', 'ApiBasePath'];
	function MenuSearchService($http, ApiBasePath) {

		var service = this;
				
		function GetAllMenuItemsFromSite() {
			var resp = $http({url: ApiBasePath + '/menu_items.json'});
			return resp;			
		}		

		service.getMatchedMenuItems = function(searchTerm) {			 
			var promise = GetAllMenuItemsFromSite().then(function(response) {
			var allItems = response.data.menu_items;
			 	if (searchTerm =='') {return [];}			 	
			 	var i=0;
			 	while (i < allItems.length) {
			 		if (!allItems[i].description.toLowerCase().includes(searchTerm)){
			 			allItems.splice(i, 1);
			 		}
			 		else {i++};
			 	}
			 	return allItems;	
			 })
			 
			return promise;
			
		}
	}


})();