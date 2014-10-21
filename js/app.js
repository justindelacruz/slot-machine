(function($) {
	/**
     * Espresso Bar Slot Machine
	 * 
	 * Usage: $(selector).SlotMachine(options)
     */
	var SlotMachine = function(el, o) {
		/**
		 * Config vars
		 * @type {object}
		 */
		var options = {
				numReels: 3,
				numPrizes: 3,
				numSpins: 4, 
				spinDuration: 300,
				minimumLastSpinDuration: 1000,
				additionalLastSpinDuration: 500,
				classes: {
					playButton: '.machine-play-button',
					reel: '.machine-reel'
				}
			},
			/**
			 * True when a game is in progress
			 * @type {boolean}
			 */
			isPlaying = false,
			/**
			 * The results of the current game are stored as integers in an array.
			 * The integers range from 0..numReels-1.
			 * @type {Array}
			 */
			results = [],
			/**
			 * Reference to bound element
			 * @type {*|HTMLElement}
			 */
			$el = $(el),
			/**
			 * The value of the current game's winner, or false if not a winner.
			 * @type {boolean}|{integer}
			 */
			winner = false;
		
		/**
		 * Slot machine constructor
		 * @constructor
		 * @param {object} el - This element
		 * @param {object} o - Module options
		 */
		var _init = function(o) {
			options = $.extend({}, options, o);
			_setupEvents();
		};
	
		/**
		 * Bind events 
		 * @private
		 */
		var _setupEvents = function() {
			$el.on('click', options.classes.playButton, _handleClickEvent);
		};

		/**
		 * Handle click event
		 * @private
		 */
		var _handleClickEvent = function() {
			if (!isPlaying) {
				_play();
			}
		};
		
		/**
		 * Execute the game
		 * @private
		 */
		var _play = function() {
			var spinningDuration = options.spinDuration * options.numSpins,
				maxEndDuration = 0,
				endDuration;
			
			_resetGame();
			_startGame();
			_pickResults();
			
			window.setTimeout(function() {
				$el.find(options.classes.reel).each(function(index) {
					endDuration = Math.floor(Math.random() * options.additionalLastSpinDuration) + options.minimumLastSpinDuration;
					maxEndDuration = Math.max(endDuration, maxEndDuration);
					
					// Stop reels					
					$(this).find('ul')
						.addClass('done-'+results[index])
						.css('-webkit-animation-duration', endDuration+'ms');		
				});
				
				window.setTimeout(function() {
					// Show win/lose screen
					$el.addClass(winner !== false ? 'machine-winner machine-winner-'+winner : 'machine-not-winner');
					_stopGame();
				}, maxEndDuration + 500);
			}, spinningDuration);
		};
		
		/**
		 * Reset DOM classes when starting a new game
		 * @private
		 */
		var _resetGame = function() {
			$el.removeClass('machine-winner machine-not-winner');
			if(winner !== false) {
				$el.removeClass('machine-winner-'+winner);
				winner = false;
			}
			$el.find(options.classes.reel).each(function(index) {
				$(this).find('ul')
					.removeClass('done-'+results[index])
					.removeAttr('style');
			});
		};

		/**
		 * Set active game state
		 * @private
		 */
		var _startGame = function() {
			$el.addClass('active');
			isPlaying = true;
		};

		/**
		 * Set inactive game state
		 * @private
		 */
		var _stopGame = function() {
			$el.removeClass('active');
			isPlaying = false;
		};
		
		/**
		 * Randomly determine the results of the game
		 * @private
		 */
		var _pickResults = function() {
			$el.find(options.classes.reel).each(function(index) {
				results[index] = Math.floor(Math.random() * options.numReels);
			});
			
			winner = _getWinner();
		};

		/**
		 * Returns the winning value if the values in the results array are the same.  
		 * Returns false if the values in the results array are *not* the same.
		 * @returns {boolean}|{integer}
		 * @private
		 */
		var _getWinner = function() {
			var winner = results.reduce(function(a, b) {
				return (a === b) ? a : false;
			});
			
			return winner === false ? false : winner;
		};
		
		_init(o);
	};
	
	$.fn.slotMachine = function(options) {
		return this.each(function() {
			new SlotMachine(this, options);
		});
	};
	
	$(document).foundation();
	$('#slotMachine').slotMachine({});
})(jQuery);