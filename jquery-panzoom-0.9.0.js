/*
 * jQuery PanZoom Plugin
 * Pan and zoom an image within a parent div.
 * 
 * version: 0.9.0
 * @requires jQuery v1.4.2 or later (earlier probably work, but untested so far)
 *
 * Copyright (c) 2011 Ben Lumley
 * Examples and documentation at: http://benlumley.co.uk/jquery/panzoom
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
*/

(function( $ ){

  $.fn.panZoom = function(method) {
  	
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist' );
    }
	
  };

	$.fn.panZoom.defaults = {
      zoomIn   	: 	false,
      zoomOut 	: 	false,
		  panUp			:		false,
		  panDown		:		false,
		  panLeft		:		false,
		  panRight	:		false,
			fit				: 	false,
		  out_x1		:		false,
		  out_y1		:		false,
		  out_x2		:		false,
		  out_y2		:		false,
			zoom_step	:   5,
			pan_step  :   5,
			debug			: 	false,
			directedit:   false
  };
  
	var settings = {}

  var methods = {
		'init': function (options) {
			$.extend(settings, $.fn.panZoom.defaults, options);
			setupBindings.apply(this);
			setupCSS.apply(this);
  		setupData.apply(this);
		},
	
		'destroy': function () {
			$(window).unbind('.panZoom');
			this.removeData('panZoom');
		},
		
	  'readPosition': function () {
				var data = this.data('panZoom');
		 		if (settings.out_x1) { data.position.x1 = settings.out_x1.val(); }
		 		if (settings.out_y1) { data.position.y1 = settings.out_y1.val() }
		 		if (settings.out_x2) { data.position.x2 = settings.out_x2.val() }
		 		if (settings.out_y2) { data.position.y2 = settings.out_y2.val() }
				methods.updatePosition.apply(this);
		 },
		
		'updatePosition': function() {
			validatePosition.apply(this);
			writePosition.apply(this);
			applyPosition.apply(this);
		},

	  'fit': function () { 
			var data = this.data('panZoom');
			data.position.x1 = 0;
			data.position.y1 = 0;
			data.position.x2 = data.target_dimensions.x;
			data.position.y2 = data.target_dimensions.y;
			methods.updatePosition.apply(this);
		},

		'zoomIn': function (target) { 
			var data = this.data('panZoom');
			var steps = getStepDimensions.apply(this);
			data.position.x1 += steps.zoom.x;
			data.position.x2 -= steps.zoom.x;
			data.position.y1 += steps.zoom.y;
			data.position.y2 -= steps.zoom.y;
			methods.updatePosition.apply(this);
		 },
	
		'zoomOut': function () { 
			var data = this.data('panZoom');
			var steps = getStepDimensions.apply(this);
			data.position.x1 -= steps.zoom.x;
			data.position.x2 += steps.zoom.x;
			data.position.y1 -= steps.zoom.y;
			data.position.y2 += steps.zoom.y;
			methods.updatePosition.apply(this);
		 },
	
		'panUp': function () { 
			var data = this.data('panZoom');
			var steps = getStepDimensions.apply(this);
			data.position.y1 -= steps.pan.y;
			data.position.y2 -= steps.pan.y;
			methods.updatePosition.apply(this);
		},
	
		'panDown': function () {
			var data = this.data('panZoom');
			var steps = getStepDimensions.apply(this);
			data.position.y1 += steps.pan.y;
			data.position.y2 += steps.pan.y;
			methods.updatePosition.apply(this);		
		},
	
		'panLeft': function () { 
			var data = this.data('panZoom');
			var steps = getStepDimensions.apply(this);
			data.position.x1 -= steps.pan.x;
			data.position.x2 -= steps.pan.x;
			methods.updatePosition.apply(this);			
		},
	
		'panRight': function () {
			var data = this.data('panZoom');
			var steps = getStepDimensions.apply(this);
			data.position.x1 += steps.pan.x;
			data.position.x2 += steps.pan.x;
			methods.updatePosition.apply(this);
		},
	
  }

	function setupBindings() {
		console.log('a');
		eventData = { target: this }
		
		// controls
		if (settings.zoomIn) { settings.zoomIn.bind('click.panZoom', eventData, function(event) { event.data.target.panZoom('zoomIn'); } ); }
		if (settings.zoomOut) { settings.zoomOut.bind('click.panZoom', eventData, function(event) { event.data.target.panZoom('zoomOut'); } ); }
		if (settings.panUp) { settings.panUp.bind('click.panZoom', eventData, function(event) { event.data.target.panZoom('panUp'); } ); }
		if (settings.panDown) { settings.panDown.bind('click.panZoom', eventData, function(event) { event.data.target.panZoom('panDown'); } ); }
		if (settings.panLeft) { settings.panLeft.bind('click.panZoom', eventData, function(event) { event.data.target.panZoom('panLeft'); } ); }
		if (settings.panRight) { settings.panRight.bind('click.panZoom', eventData, function(event) { event.data.target.panZoom('panRight'); } ); }
		if (settings.fit) { settings.fit.bind('click.panZoom', eventData, function(event) { event.data.target.panZoom('fit'); } ); }

		
		// direct form input
		if (settings.directedit) {
			console.log($(settings.out_x1, settings.out_y1, settings.out_x2, settings.out_y2));
			$(settings.out_x1, settings.out_y1, settings.out_x2, settings.out_y2).bind('change.panZoom keyup.panZoom', eventData, function(event) { event.data.target.panZoom('readPosition') } );
		}
		
	}

	function setupData() {
		this.data('panZoom', {
			target_element: this,
			target_dimensions: { x: this.width(), y: this.height()  },
			viewport_element: this.parent(),
			viewport_dimensions: { x: this.parent().width(), y: this.parent().height() },
			position: { x1: null, y1: null, x2: null, y2: null }
		});		
		methods.readPosition.apply(this);
	}

	function setupCSS() {
		this.parent().css('position', 'relative');
		this.css({
			'position': 'absolute',
			'top': 0,
			'left': 0
		});
	}
  
	function validatePosition() {
		var data = this.data('panZoom');
		
		// if dimensions are zero...
		if ( data.position.x2 - data.position.x1 < 1 || data.position.y2 - data.position.y1 < 1 ) {
			// and second co-ords are zero (IE: no dims set), fit image
			if (data.position.x2 == 0 || data.position.y2 == 0) {
				methods.fit.apply(this);
			} 
			// otherwise, backout a bit
			else {
				data.position.x2 = data.position.x1+1;
	  		data.position.y2 = data.position.y1+1;
			}
		}
		
		
	}

  function applyPosition() {
		var data = this.data('panZoom');
		
		src_width = data.position.x2 - data.position.x1;
  	src_height = data.position.y2 - data.position.y1;

		width_ratio = data.viewport_dimensions.x / src_width;
		height_ratio = data.viewport_dimensions.y / src_height;
		
		width = data.target_dimensions.x * width_ratio;
		height = data.target_dimensions.y * height_ratio;
		
		left = data.position.x1 * width_ratio;
		top = data.position.y1 * height_ratio;
		
		this.height(height);
		this.width(width);
		this.css('top', -top);
		this.css('left', -left);
		
		if (settings.debug) {
			console.log('width:' + width);
			console.log('height:' + height);
			console.log('left:' + left);
			console.log('top:' + top);
		}
	}
	
	function writePosition() {
		var data = this.data('panZoom');
 		if (settings.out_x1) { settings.out_x1.val(data.position.x1) }
 		if (settings.out_y1) { settings.out_y1.val(data.position.y1) }
 		if (settings.out_x2) { settings.out_x2.val(data.position.x2) }
 		if (settings.out_y2) { settings.out_y2.val(data.position.y2) }			
	}
	
	function getStepDimensions() {
		var data = this.data('panZoom');
		ret = {
			zoom: {
				x: settings.zoom_step/100 * data.viewport_dimensions.x,
				y: settings.zoom_step/100 * data.viewport_dimensions.y
			},
			pan: {
				x: settings.pan_step/100 * data.viewport_dimensions.x,
				y: settings.pan_step/100 * data.viewport_dimensions.y
			}
		}
		return ret;
	}
  
})( jQuery );