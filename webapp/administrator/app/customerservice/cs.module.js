(function() {
	"use strict";

	var csModule = angular.module('app.cs', []);

	csModule.config(routeConfig);
	csModule.controller('CSCtrl', CSCtrl);

	function CSCtrl($scope, $rootScope, $firebaseObject, $firebaseArray) {
		var vm = this;
		var myDataRef = new Firebase($rootScope.mainUrl + "/customerservice");
		var fArray = $firebaseArray(myDataRef);
		// var fObj = $firebaseObject(myDataRef);
		// fObj.$loaded().then(function() {
		// 	_.every(fObj, function(v, k) {
		// 		console.log(k, v)
		// 		return true;
		// 	})
			
		// 	console.log(fObj.$ref().key())
		// });

		vm.custServices = [];
		vm.newCS = {};

		vm.save = save;
		vm.remove = remove;
		vm.update = update;

		activate();
		function activate() {
			fetchData();
			startListener();
		}

		function update() {
			
		}

		function findObjById(id) {
			return _.find(fArray, function(o) {
				return o.$id === id;
			})
		}

		function remove(id) {
			fArray.$remove(findObjById(id)).then(function(r) {
				console.log(r.key());
			})
		}

		function save() {
			doSave(vm.newCS);
		}

		function doSave(data) {
			fArray.$add(data).then(function(r) {
				console.log("success : ", r.key());
			});
		}

		function fetchData() {
			var syncObject = $firebaseObject(myDataRef);
			syncObject.$bindTo($scope, "custServices");
		}

		function startListener() {
			$scope.$watch(function(a) { 
				vm.custServices = [];
				_.every(a.custServices, function(d, i) {
					if (d && d.username && d.password) {
						vm.custServices.push(d);
					}
					return true;
				});
			});
		}

		function updateList(list) {
			vm.custServices = list;
		}
	}

	function routeConfig($stateProvider) {
		$stateProvider
			.state("cs", {
				url: "/cs",
				templateUrl: "app/customerservice/cs.html",
				controller: "CSCtrl",
				controllerAs: "vm"
			});
	};
})();