# Summary #

Pan and zoom an image within a parent div using any combination of buttons (anything you can bind a click to), mousewheel and drag/drop.

Plugin can also read/write the co-ordinates of the image within the parent div to/from a (probably hidden) form field for easy integration into your own projects.

Live example available at: [http://benlumley.co.uk/dev/panzoom/example/index.html](http://benlumley.co.uk/dev/panzoom/example/index.html)

# Licence #

Copyright (c) 2011 Ben Lumley  
Examples and documentation at: [https://github.com/benlumley/jQuery-PanZoom](https://github.com/benlumley/jQuery-PanZoom])  

Dual licensed under the MIT and GPL licenses:  
 [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)  
 [http://www.gnu.org/licenses/gpl.html](http://www.gnu.org/licenses/gpl.html)

# Usage #

In addition to this documentation, a working example showing all options is available from the github repository linked above.

Include jquery and the plugin's js files.

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    <script type="text/javascript" src="/js/jquery-panzoom-0.9.0.js"></script>

If you want to enable the mousewheel setting you need jQuery tools' mousewheel tool, and draggable needs jQuery UI:

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js"></script>
    <script type="text/javascript" src="http://cdn.jquerytools.org/1.2.5/all/jquery.tools.min.js"></script>

First, you need a div with a width and height specified, and inside that place the image. This becomes the area within which your image can be panned and zoomed. Create html thats something like this:

    <div id="pan" style="width: 200px; height: 300px;">
      <img src="/images/myimage.jpg" >
    </div>

Then initialise the plugin by calling (best to use $(document).ready() for this, as in the eg):

    $(document).ready(function () {
    	$('#pan img').panZoom(options);
    });

You need to pass some options for the plugin to do anything - see below. So a working example might be (see below for an explanation of options):

    $(document).ready(function () {
      $('#pan img').panZoom({
        'zoomIn'    :  $('#zoomin'),
        'zoomOut'   :  $('#zoomout'),
        'panUp'     :  $('#panup'),
        'panDown'   :  $('#pandown'),
        'panLeft'   :  $('#panleft'),
        'panRight'  :  $('#panright'),
        'fit'       :  $('#fit')
      });
    });

# A Note On How PanZoom Handles Co Ordinates #

The plugin stores and outputs the position of the top left corner of the image and the bottom right corner. The top left is x1,y1, the bottom right is x2,y2 and is equivalent to x1+width, y2+height.

# Options #

Where appropriate, defaults are given in brackets.

### zoomIn, zoomOut, panUp,  panDown, panLeft, panRight,

Pass a (different) jQuery dom node in to each of these options, the relevant action will be bound to the click event of that element. EG: 

    { zoomIn: $('#zoomIn') }. 

If you don't pass in at least one of these options, the plugin won't be able to do anything.

### fit

Pass in a jQuery dom node to bind the fit action to. This can be thought of as a reset button, it will center the image within the div and size it as large as possible within the div.

### out\_x1, out\_y1, out\_x2, out\_y2

Pass in jQuery dom nodes for the form elements to read/write the position of the image from. The plugin will initialise using the values in these fields if valid.

### zoom\_step, pan\_step (3, 3)

Percentage of the image's dimensions to zoom/pan at once when the controls are clicked. In short, increase to make the plugin zoom/pan in larger steps, and vice versa

### min\_width, min\_height (20, 20)

The width/height of the image (according to the output co-ordinates) can't be less than the respective value here.

### debug

The plugin will console.log the current co-ordinates. Beware, will break things if console.log isn't available in your browser.

### directedit (false)

Boolean. If true, the form will monitor the form fields passed in to out_x1 etc for changes and will update the image accordingly. Probably best used with form fields that aren't hidden :) 

### aspect (true)

boolean, whether the plugin should keep the original aspect ratio (length/width) of the source image.

### factor (1)

Pass a number in here if you wish to have the plugin scale up/down the values used in the form fields relative to the actual pixel offsets of the image within the div.

### animate (true)

Boolean - whether to animate the zoom in/out, pan actions, or just change them. (jQuery's css method or animate method). For animate, see following two options.

NB: Animate doesn't start until the plugin has initialised the first image properly, as doing so lets the user see the initial image shrinking etc, rather than it appearing instant. 

### animate\_duration (200)

If animate\_enabled is true, duration for the animations  - passed directly into jQuery's animate method.

### animate\_easing (linear)

If animate\_enabled is true, easing method for the animations  - passed directly into jQuery's animate method.

### double_click (true)

Boolean - whether double clicking the image should trigger zoom in.

### mousewheel

Boolean - whether to enable mousewheel to zoom or not. Requires mousewheel from jquery tools - http://flowplayer.org/tools/toolbox/mousewheel.html

### mousewheel_delta (1)

Amount of mousewheel movement thats equivalent to one click of the zoom button. Be warned that this seems to be influenced by browser choice as well as people's settings for their mousewheel in their operating system.

### draggable (true)

Should the image be made "draggable"? Requires jQuery UI - http://jqueryui.com/

### clickandhold (true)

Should the zoom/pan controls contine to zoom/pan for as long as you click on the control? If false, each click causes one pan/zoom step.

# Public Methods #

Methods can all be called via 

    $(selector).panZoom('methodname', arg1, arg2)

Which would call

    methodname(arg1, arg2)

### panLeft, panRight, panUp, panDown

These are the methods used by the event handlers for the relevant controls. You can make manual calls to these or bind them to extra elements to integrate panZoom into more complicated interfaces.

### zoomIn( [steps] ), zoomOut( [steps] )

Similar to the above, these are the methods used by the event handlers for zoom in/out and can be called directly. 

They take an optional steps argument, which dictates how far will be zoomed in and out. If not provided, a default is used based on the size of the image panZoom is working with and the zoom\_step config value passed when you initialised panZoom.

Steps should be an object like look like:

		{
			zoom: {
				x: 10,
				y: 10
			}
		}

The units represent the amount to increment/decrement the x1,y1,x2,y2 values by.

### mouseWheel(delta)

This is the handler for mousewheel events. It takes one argument, delta, which represents the amount and direction of mouse movement.

### fit

This is used for the reset handler. It will re-center the image in the containing div and will size it as large as possible, respecting the aspect if appropriate (according to the settings).

### readPosition

Forces panZoom to reload co-ordinates from the output form fields. Useful to call after manually setting position, and is bound to the change and blur events if directedit is enabled.

### dragComplete

This is called after a drag event, hence it's name. It reads the co-ordinates of the image from css top, left, width and height and applies them to the output fields. 

### updatePosition

Re-applies the internal co-ordinates in the data object to the output form fields and sets the image position accordingly. Useful if you have directly manipulated the current image co-ordinates in the data object to force panZoom to apply the new co-ordinates.

### loadImage

Bound to the main image's change event - possibly of little use aside from this - causes panZoom to re-read the image size, and fit the image if it's changed.

### destroy

Removes the panZoom instance.

### mouseDown(action, [arg1, arg2])

This is a wrapper method used to call other methods via setInterval to provide the clickandhold functionality. It takes a method (action) to call - eg: 'panUp' and optional arguments to pass to it. It calls this once and then uses javascript's setInterval to repeatedly call it if clickandhold is enabled.

### mouseUp

Clears the setInterval from mouseDown. Bound to the mouseleave and mouseup events of relevant controls.

# Tips #

## Swapping the image ##

A load event is bound to the image when the plugin is initialised, so if you swap the image via something like

    $('#pan img').attr('src', '/someimage.png');

the plugin will automatically fit the new image to the box once it loads.

## Manually setting image position ##

You can manually change the image position from javascript using something like:

    // retrieve the current position
    data = $('#pan img').data('panZoom');

    // set the four co-ordinates
    data.position.x1 = 10;
    data.position.y1 = 10;
    data.position.x2 = 50;
    data.position.y2 = 50;

    // write out the position
    $('#pan img').panZoom('updatePosition');
    
(yes, a utility method for this would be nicer/cleaner. Its on the list!)

You could also do this via the directedit setting and changing the form field values.

## Feature Wishlist

Few extra utility methods  
Rotation (supported browsers only)  
Draggable snap  
Fix diving to corner as you zoom out past limits  
Zoom should zoom the image towards the point that is currently at center of viewport - currently it zooms to center of image wherever that may be, so if zoomed in, it effectively pans for you.   
Verify destroy

