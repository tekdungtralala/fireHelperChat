(function() {
	"use strict";

	angular.module('app', [
		"ui.router",
		"firebase",
		
		"app.cs"
	])
	.config(configRoute)
	.run(appRun);

	function configRoute($urlRouterProvider) {
		$urlRouterProvider.otherwise("/cs");
	};

	function appRun($rootScope) {
		$rootScope.mainUrl = "https://firehelperchat.firebaseio.com";
	}

})();