(function(bModule) {
	'use strict';
	/*jslint browser: true */

	function replaceAll(string, operator, replacement) {
		return string.split(operator).join(replacement);
	}

	modV.prototype.startUI = function() {
		var self = this;

		var gallery = document.getElementsByClassName('gallery')[0];
		var list = document.getElementsByClassName('active-list')[0];
		Sortable.create(list, {
			group: {
				name: 'modV',
				pull: true,
				put: true
			},
			handle: '.handle',
			chosenClass: 'chosen',
			onAdd: function(evt) {
				console.log('drop', evt);
				// Dragged HTMLElement
				var itemEl = evt.item;
				// Cloned element
				var clone = gallery.querySelector('.gallery-item[data-module-name="' + itemEl.dataset.moduleName + '"]');

				// Get Module
				var Module = self.registeredMods[replaceAll(itemEl.dataset.moduleName, '-', ' ')];

				// Grab dataname from cloned element
				var name = clone.dataset.moduleName;
				// Check for dupes
				var dupes = list.querySelectorAll('.active-item[data-module-name|="' + name.replace(' ', '-') + '"]');

				// Convert back to display name
				name = replaceAll(name, '-', ' ');

				// Add on dupe number for name if needed
				if(dupes.length > 0) {
					name += " (" + dupes.length + ")";
				}

				// Create new safe name
				var safeName = replaceAll(name, ' ', '-');

				if(dupes.length > 0) {
					// Clone module -- afaik, there is no better way than this
					var oldModule = Module;
					Module = self.cloneModule(Module, true);

					// Create new controls from original Module to avoid scope contamination
					if('controls' in oldModule.info) {

						Module.info.controls = [];

						oldModule.info.controls.forEach(function(control) {

							var settings = control.getSettings();
							var newControl = new control.constructor(settings);
							console.log(newControl);
							Module.info.controls.push(newControl);

						});

					}

					// init cloned Module
					if('init' in Module) {
						Module.init(self.canvas, self.context);
					}
					
					// update name, add to registry
					Module.info.name = name;
					Module.info.safeName = safeName;
					self.registeredMods[Module.info.name] = Module;
				}

				// Move back to gallery
				swapElements(clone, itemEl);

				var activeItemNode = self.createActiveListItem(Module);

				// Replace clone
				list.replaceChild(activeItemNode, clone);

				self.setModOrder(name, evt.newIndex);

				// Create controls
				console.log('Creating controls for', name, Module);
				self.createControls(Module, self);

				// turn on
				// TODO: add setting to enable/disable by default
				Module.info.disabled = false;

				activeItemNode.focus();
			},
			onEnd: function(evt) {
				self.setModOrder(replaceAll(evt.item.dataset.moduleName, '-', ' '), evt.newIndex);
			}
		});

		Sortable.create(gallery, {
			group: {
				name: 'modV',
				pull: 'clone',
				put: false
			},
			draggable: '.gallery-item',
			sort: false
		});

		window.addEventListener('focusin', activeElementHandler);
		window.addEventListener('focusout', clearActiveElement);

		function clearPanels() {
			var panels = document.querySelectorAll('.control-panel');

			// :^) hacks hacks hacks
			[].forEach.call(panels, function(panel) {
				panel.classList.remove('show');
			});

		}

		function activeElementHandler(evt) {
			var eventNode = evt.srcElement.closest('.active-item');
			var dataName = eventNode.dataset.moduleName;
			var panel = document.querySelector('.control-panel[data-module-name="' + dataName + '"]');
			
			clearPanels();
			panel.classList.add('show');
		}

		function clearActiveElement(evt) {
			console.log('clear');
		}

		// Create Global Controls
		var template = self.templates.querySelector('#global-controls');
		var globalControlPanel = document.importNode(template.content, true);

		document.querySelector('.global-control-panel-wrapper').appendChild(globalControlPanel);

		// Pull back initialised node from DOM
		globalControlPanel = document.querySelector('.global-control-panel-wrapper .global-controls');


		globalControlPanel.querySelector('#clearingGlobal').addEventListener('change', function() {
			self.clearing = this.checked;
		});

		globalControlPanel.querySelector('#monitorAudioGlobal').addEventListener('change', function() {
			self.muted = this.checked;
		});

		var audioSelectNode = globalControlPanel.querySelector('#audioSourceGlobal');
		var videoSelectNode = globalControlPanel.querySelector('#videoSourceGlobal');

		// Set up media sources
		self.mediaStreamSources.audio.forEach(function(audioSource) {
			var optionNode = document.createElement('option');
			optionNode.value = audioSource.id;
			optionNode.textContent = audioSource.label;
			audioSelectNode.appendChild(optionNode);
		});

		self.mediaStreamSources.video.forEach(function(videoSource) {
			var optionNode = document.createElement('option');
			optionNode.value = videoSource.id;
			optionNode.textContent = videoSource.label;
			videoSelectNode.appendChild(optionNode);
		});

		audioSelectNode.addEventListener('change', function() {
			self.setMediaSource(this.value, videoSelectNode.value);
		});

		videoSelectNode.addEventListener('change', function() {
			self.setMediaSource(audioSelectNode.value, this.value);
		});

		globalControlPanel.querySelector('#factoryResetGlobal').addEventListener('click', function() {
			self.factoryReset();
		});


	};

})(module);