function AppCtrl($log, $mdSidenav, $mdDialog, $mdToast, ngHue, $localStorage, AppSettings) {
	'ngInject';
	// ViewModel
	const vm = this;


	vm.closeMenu = function() {
		$mdSidenav('menu').close()
			.then(function(){
				$log.debug('open LEFT is done');
			});
	};
	
	vm.toggleMenu = function() {
		$mdSidenav('menu').toggle();
	}
  
  function showHueSetup() {
  // Appending dialog to document.body to cover sidenav in docs app
  var confirm = $mdDialog.confirm()
        .title('We found a Hue Bridge on your Network!')
        .textContent('To enable Phillips Hue integration, please tap the button on your Bridge, then tap Done')
        .ariaLabel('Enable Hue Integration')
        .ok('Done')
        .cancel('cancel');
    $mdDialog.show(confirm).then(function() {
		_createHueUser();
    }, function() {
		return;
    });
	};

  if ($localStorage.HueUsername===undefined){
	  _createHueUser();
  }
else {
	connectToHue($localStorage.HueUsername);
}

function _createHueUser()
{
  	ngHue.createUser(AppSettings.HueAppName).then(function successCallback(response) {
		$localStorage.HueUsername = response[0].success.username;
		connectToHue($localStorage.HueUsername);
  	}, function errorCallback(response) {
		if (response[0].error.type === 101) {
			showHueSetup();
		};
  	});
}

function connectToHue(username){
	ngHue.setup({
		username: username
	})
	$mdToast.show(
	      $mdToast.simple()
	        .textContent('connected to Hue Bridge')
	        .hideDelay(3000)
	    );
}
	
}

export default {
	name: 'AppCtrl',
	fn: AppCtrl
};
