# modV

modV is a modular audio visualisation framework written in JavaScript.
Some goals of this project:

  - To find the fastest way to render
  - More goals
  - even more goals (ambitious, huh?)

Okay, modV is still in alpha(ish) and so these docs aren't complete as of yet - as you may be able to tell :s

##How to run:
###Requirements

Browser: Google Chrome desktop

OS: any that support desktop Chrome.

Device specs: UNKNOWN. modV was developed on a Late 2011 MBP with 16GB of RAM installed - so let me know how you get on with your specs.

Web server or local server to host the project
Check this guide out to help you spin one up on your Mac:
http://lifehacker.com/start-a-simple-web-server-from-any-directory-on-your-ma-496425450

Or alternatively you can go here and use it without downloading: http://2xaa.github.io/modV-alpha-/
But this only allows you to use the example modules, unless you're cool with loading stuff in using the console.

####Optional
#####Audio routing:
Routing audio to other applications (say routing a music player as a virtual line-in) can be a bit tricky sometimes, but luckily there are some free solutions for this:

Windows:
http://vb-audio.pagesperso-orange.fr/Cable/ 

* Click the orange download button and install
* Set the output of your computer speakers to the VB-Audio cable
* Configure the VB-Audio recording device to 'listen' through your normal output
* Tell Chrome to use the VB-Audio cable input for modV when asked for user media

Mac:
https://rogueamoeba.com/freebies/soundflower/

* Download and install SoundFlower, you will have to restart
* After the port-install restart, launch SoundFlower
* In the Sound pane in System Preferences set the output to SoundFlower 2ch
* On the SoundFlower menu item set the output of the 2ch to your usual audio output
* Tell Chrome to use the SoundFlower 2ch input for modV when asked for user media

#####Meyda:
If the module developer wants, they can use [meyda](https://github.com/hughrawlinson/meyda) for expanded audio analysis. Ideally you'll just include meyda at all times to account for this, but modV can be run without meyda too.

###Using
Using modV is fairly straightforward.

The basic setup for modV is as follows:
```HTML
<head>
	<link rel="stylesheet" href="control-stylesheet.css" />
</head>
<body>
	<canvas></canvas>
	<script src="modV.js"></script>
	<!-- Load modules here, waveform as example -->
	<script src="./modules/waveform.modV.js"></script>
	<script>
		var modV = new modV();
		modV.setCanvas(document.getElementsByTagName('canvas')[0]);
		modV.setDimensions(window.innerWidth, window.innerHeight);
		modV.registerMod(waveform);
		modV.start();
	</script>
</body>
```

* You **must** allow popups and also the userMedia request to access both webcam and audio input as modV abstracts both to be used within its modules.
* Twiddle settings until you get the desired output.
* You can drag the red balls at the side to reorder the modules up and down.
* Some modules allow images, to change the images drag and drop a new one on.
* Some modules allow multiple images, such as starField.
  * Hold ALT as you drag to remove the previous images and overwrite with the new images, drag normally to add onto the images previous.

*will expand this at some point*
###Developing
The modules were built to reflect Processing, with a few quirks.

There has to be this basic layout or your module WILL NOT work:

```JavaScript
var modName = function() {
	
	this.info = {
		name: 'modName',
		author: '2xAA',
		version: 0.1,
		controls: [
			{type: 'range', variable: 'variable1', min: 1, max: 20, label: 'Variable 1 Label'},
			{type: 'range', variable: 'variable2', min: 1, max: 20, label: 'Variable 2 label'}
		]
	};
	
	/*
	  this is the info object
	  you need to include the name at least of your module will not register
	  other things you may include are notes, version number, author and control exports
	  
	  control exports will be fully documented at a later stage
	  please refer to the example modules for usage
	*/
	
	// Public Variables (control exports **must** point to public variables)
	this.variable1 = 1;
	this.variable2 = 13;
	
	this.init = function(canvas) {
		
	};
	
	/*
	  init is run when the module is registered
	  it provides the canvas element primarily to set the size
	  but you can use it to setup other things within your module too ahead of runtime
	*/
		
	this.draw = function(canvas, ctx, audio, video, meyda) {
			
	};
	
	/*
	  draw is run every frame
	  it provides:
	    the canvas element
	    the 2d context
	    the audio array (see the example waveform module for a good example on usage)
	    the video from the webcam selected (see the example webcam module for a good example on usage)
	    
	  draw will be fully documented at a later stage
	  please refer to the example modules for usage
	*/
	
};
```

Please see the bundled modules for extra stuff.

*will expand this at some point*
