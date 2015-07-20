$(document).ready(function() {
	var btnSubmit = $('#btn-submit');
	var btnChat = $('#btn-chat');
	var url = 'https://firehelperchat.firebaseio.com';
	var ref = new Firebase(url);
	var newClientId = null;

	var panelForm = $('#panelForm');
	var panelChat = $('#panelChat');

	activate();
	function activate() {
		registerListener();
	}

	function registerListener() {
		btnSubmit.click(function() {
			var name = $('#name').val();
			var email = $('#email').val();
			var website = $('#website').val();
			var question = $('#question').val();
			var hasError = !name || !email || !website || !question;
			
			if (!name) $('.form-name').addClass('has-error');
			else $('.form-name').removeClass('has-error');

			if (!email) $('.form-email').addClass('has-error');
			else $('.form-email').removeClass('has-error');

			if (!website) $('.form-website').addClass('has-error');
			else $('.form-website').removeClass('has-error');

			if (!question) $('.form-question').addClass('has-error');
			else $('.form-question').removeClass('has-error');

			if (!hasError) {
				updateReff('client');
				var r = ref.push({name: name, email: email, website: website, process: 1}, afterPushNewClient);
				newClientId = r.key();
			}
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

	function initChat() {
		updateReff('chat/' + newClientId);

		ref.on('child_added', function(snapshot, prevChildKey) {
			var val = snapshot.val();
			val.time = getFormatedTime(val.timestamp);
			val.isYour = val.userType === 1;
			appendChatData(val);
		});
	}

	function afterPushNewClient(e) {
		if (e) {
		} else {
			var question = $('#question').val();
			initChat();
			pushMsg(question);

			appendChatData({
				name: 'Bot-reply',
				time: '',
				text: 'Please wait until our CS response.'
			});
		}
	}

	function pushMsg(question) {
		var data = {
			name: $('#name').val(), 
			userType: 1, 
			text: question, 
			timestamp: Firebase.ServerValue.TIMESTAMP
		};
		ref.push(data, afterPushChat);
	}

	function afterPushChat(e) {
		if (e) {
		} else {
			panelChat.show();
			panelForm.hide();

			var name = $('#name').val();
			var question = $('#question').val();
		}
	}

	function appendChatData(data) {
		var chatList = $('#chatList');

		var template = $('#templateChat').html();
		Mustache.parse(template);   // optional, speeds up future uses
		var rendered = Mustache.render(template, data);
		chatList.append(rendered);
	}

	function getFormatedTime(val) {
		return moment(val, 'X').format('HH:mm');
	}

	function updateReff(val) {
		ref = new Firebase(url + "/" + val);
	}
});
