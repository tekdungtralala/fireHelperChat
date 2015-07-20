$(document).ready(function() {

	var btnSubmit = $('#btn-submit');
	var btnChat = $('#btn-chat');
	var url = 'https://firehelperchat.firebaseio.com';
	var ref = new Firebase(url);
	var csLogged = {};
	var clients = [];
	var selectedClient = null;

	var panelFormLogin = $('#panelFormLogin');
	var panelActiveClient = $('#panelActiveClient');
	var panelSelectClient = $('#panelSelectClient');

	activate();
	function activate() {
		updateReff('customerservice');
		registerListener();
		// test();
	}

	function test() {
		csLogged.password = "dua";
		csLogged.username = "dua";
		csLogged.key = "-JuQbbs4mL3jRvcfEwzG";
		afterCSLogged();
	}

	function registerListener() {
		panelActiveClient.on("click", '.btn-serve', function() {
			var data = $(this).data();
			var client = findClientByKey(data.key);
  		selectClient(client);
		});

		btnSubmit.click(function() {
			var username = $('#username').val();
			var password = $('#password').val();

			ref.once("value", function(snapshot) {
				var key = null;
				csLogged = _.find(snapshot.val(), function(v, k) {
					key = k;
					return v.username === username && v.password === password;
				});
				csLogged.key = key;
				console.log(csLogged);

				if (csLogged) {
					afterCSLogged();
				} else {
					// error msg
				}
			});
		});

		btnChat.click(function() {
			var elmt = $('#inputMsg');
			var text = elmt.val();
			if (!text) {
				elmt.parent().addClass('has-error');
			} else {
				pushMsg(text);
				elmt.val('');
			}
		});
	}

	function pushMsg(msg) {
		var data = {
			name: csLogged.username, 
			userType: 2, 
			text: msg, 
			timestamp: Firebase.ServerValue.TIMESTAMP
		};
		ref.push(data, afterPushChat);
	}

	function afterPushChat(e) {
		if (e) {
			console.log("ERROR : ", e);
		} else {

		}
	}

	function selectClient(client) {
		selectedClient = client;

		panelActiveClient.hide();
		panelSelectClient.show();

		updateReff('client/' + selectedClient.key);
		ref.update({ process: 2}, afterUpdate);
	}

	function afterUpdate(e) {
		if (e) {
		} else {
			updateReff('chat/' + selectedClient.key);
			ref.on('child_added', function(snapshot, prevChildKey) {
				var val = snapshot.val();
				val.time = getFormatedTime(val.timestamp);
				val.isYour = val.userType !== 1;
				appendChatData(val);
			});
		}
	}

	function appendChatData(data) {
		var chatList = $('#chatList');

		var template = $('#templateChat').html();
		Mustache.parse(template);   // optional, speeds up future uses
		var rendered = Mustache.render(template, data);
		chatList.append(rendered);
	}

	function afterCSLogged() {
		panelFormLogin.hide();
		panelActiveClient.show();

		updateReff('client');
		ref.on('child_added', function(childSnapshot, prevChildKey) {
			if (1 === childSnapshot.val().process) {
				var tmp = childSnapshot.val();
				tmp.key = childSnapshot.key();
				appendNewClient(tmp);	
			}
		});
		ref.on('child_changed', function(childSnapshot, prevChildKey) {
			if (1 !== childSnapshot.val().process) {
				$('.' + childSnapshot.key()).remove();
			} else {
				var tmp = childSnapshot.val();
				tmp.key = childSnapshot.key();
				appendNewClient(tmp);
			}
		});
	}

	function appendNewClient(data) {
		var newClients = $('#newClients');
		clients.push(data);

		var template = $('#templateClient').html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, data);
		newClients.append(rendered);
	}

	function findClientByKey(key) {
		return _.find(clients, function(c) {
			return key === c.key;
		})
	}

	function updateReff(val) {
		ref = new Firebase(url + "/" + val);
	}

	function getFormatedTime(val) {
		return moment(val, 'X').format('HH:mm');
	}
});
