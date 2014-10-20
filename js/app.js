/**
 * Espresso Bar Slot Machine
 * 
 * TODO: Add comments
 */

(function($) {
	var SlotMachine = function(el, o) {
		var options = {
				numberOfSlots: 3,
				animationDuration: 750,
				iterationCount: 2,
				minimumEndDuration: 1000
			},
			isPlaying = false,
			results = [],
			$el = $(el),
			playButtonClass = '.machine-play-button',
			reelClass = '.machine-reel';
		
		/**
		 * Slot machine constructor.
		 * @constructor
		 * @param {object} el - This element
		 * @param {object} o - Module options
		 */
		var init = function(o) {
			options = $.extend({}, options, o);
			_setupEvents();
		};
	
		/**
		 * Bind event
		 */
		var _setupEvents = function() {
			$el.on('click', playButtonClass, _handlePlay);
		};
		
		var _handlePlay = function() {
			_startGame();
			_resetGame();
			_pickResults();
			
			window.setTimeout(function() {
				_isWinner() ? $el.addClass('winner') : $el.addClass('notWinner');
				
				$el.find(reelClass).each(function(index) {
					$(this).find('ul')
						.addClass('done-'+results[index])
						.css('-webkit-animation-duration', (Math.floor(Math.random() * 500) + options.minimumEndDuration)+'ms');
				});
				
				_stopGame();
			}, options.animationDuration * options.iterationCount);
		};
		
		/**
		 * Bind click event
		 */
		var _resetGame = function() {
			$el.removeClass('winner notWinner');
			$el.find(reelClass).each(function(index) {
				$(this).find('ul')
					.removeClass('done-'+results[index])
					.removeAttr('style');
			});
		};
		
		var _startGame = function() {
			isPlaying = true;
			$el.addClass('active');
		};
		
		var _stopGame = function() {
			$el.removeClass('active');
			isPlaying = false;
		};
		
		/**
		 * Bind click event
		 */
		var _pickResults = function() {
			$el.find(reelClass).each(function(index) {
				results[index] = Math.floor(Math.random() * options.numberOfSlots);
			});
		};
		
		var _isWinner = function() {
			var isWinner = results.reduce(function(a, b){
				return (a === b) ? a : false;
			});
			
			return isWinner === false ? false : true;
		};
		
		init(o);
	};
	
	$.fn.slotMachine = function(options) {
		return this.each(function() {
			(new SlotMachine(this, {}));
		});
	};
	
	$(document).foundation();
	$('#slotMachine').slotMachine();
})(jQuery);