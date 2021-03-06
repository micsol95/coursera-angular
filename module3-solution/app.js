(function () {
  "use strict";

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);


  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;

    ctrl.isEmpty = function () {
      if (ctrl.found) {
        return ctrl.found.length === 0;
      } else return false;
    };

    ctrl.search = function (searchTerm) {
      var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
      if(promise){
        promise.then(function (data) {
          ctrl.found = data;
        })
      } else {
        ctrl.found = [];
      }
    };

    ctrl.removeItem = function (index) {
      if (ctrl.found) ctrl.found.splice(index, 1);
    }
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    this.getMatchedMenuItems = function (searchTerm) {
      if (searchTerm) {
        return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json').then(function (response) {
          return response.data.menu_items.filter(function (item) {
            return item.description.indexOf(searchTerm) !== -1;
          })
        });
      }
    }
  }

  function FoundItemsDirective() {
    return {
      templateUrl: 'foundItemsList.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'ctrl',
      bindToController: true
    };
  }
})();
