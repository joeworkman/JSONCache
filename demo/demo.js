$(function() {

	"use strict"; // trigger ECMAScript 5 Strict Mode

	var $console = $('#jc-console');
	var $fetch = $('#jc-fetch');
	var $clear = $('#jc-clear');
	var $resetConsole = $('#jc-resetConsole');
	var consoleContentHeight = 0;

	// Left-pads the given string with zeroes to the given length.
	var pad = function(str, length) {
		str = '' + str;
		length = length || 2;
		while (str.length < length)
			str = '0' + str;
		return str;
	};

	// Adds an entry to the "console" on the page.
	var log = function(message, type) {

		var d = new Date();

		var $li = $('<li />');
		$li.addClass('jc-' + (type || 'neutral'));

		var $ts = $('<span class="jc-timestamp"></span>');
		$ts.text(pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds(), 3) + ' ');

		var $msg = $('<span class="jc-message"></span>');
		$msg.text(message);

		$console.append($li.append($ts, $msg));

		consoleContentHeight += $li.outerHeight();
		$console.scrollTop(Math.max(0, consoleContentHeight - $console.height()));

	};

	// Overrides the default $.ajax delegation to allow fiddling with the responses.
	JSONCache._getJSONProxy = function (url, options) {
        $.ajax(url + '?' + new Date().getTime(), options);
    };

	// Fetches content from the server using JSONCache.getCachedJSON().
	$fetch.click(function() {

		var url = 'data.json';
		var date = new Date();

		log('Fetching: ' + url);

		JSONCache.getCachedJSON(url, {
			success: function(data) {
				var timeDelta = pad(new Date().getTime() - date.getTime());
				log(timeDelta + ' ms => ' + JSON.stringify(data), 'success');
			}
		});

	});

	// Clears the entire cache:
	$clear.click(function() {

		JSONCache.clear();

		log('JSONCache cleared');

	});

	// Resets the "console" on the page:
	$resetConsole.click(function() {

		$console.html('');
		consoleContentHeight = 0;

	});

});