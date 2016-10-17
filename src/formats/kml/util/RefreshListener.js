define([], function(){
	/**
	 * Utility class which is associated with every Kml file. It allows parts of the KML to ask for the refresh which will happen in the correct time.
	 * Main usage is in the different modes of refresh in the NetworkLink / Link.
	 * The refresh listener works in this fashion:
	 * 	User, which is some of the classes supporting refreshes adds event to the Refresh listener. Event has some content and
	 * @constructor
	 * @alias RefreshListener
	 */
	var RefreshListener = function(){
		this.currentActiveEvents = [];
	};

	/**
	 * It adds event which should be scheduled later on. It is necessary to store it in a structure, which will return
	 * what is to be scheduled in a fast manner.
	 * @param event {RefreshListener.Event} Event which should be part of the Refresh listeners internals.
	 */
	RefreshListener.prototype.addEvent = function(event) {
		var self = this;
		setTimeout(function(){
			self.currentActiveEvents.push(event);
		}, event.time);
	};

	/**
	 * All events, which weren't scheduled and should still be.
	 * @return {RefreshListener.Event[]} It returns all events which should have been scheduled by now.
	 */
	RefreshListener.prototype.getActiveEvents = function() {
		var activeEvents = this.currentActiveEvents.slice();
		this.currentActiveEvents = [];
		return activeEvents;
	};

	/**
	 * It represents simple Event used inside of the RefreshListener.
	 * @alias RefreshListener.Event
	 * @constructor
	 * @param type {String} type of the event. The consumers decides whether the event is relevant for them based on this type.
	 * @param payload {Object} Object representing payload of the event. It is possible to schedule event with some additional information
	 * @param time {Number} Number of milliseconds before the event should occur.
	 */
	RefreshListener.Event = function(type, time, payload) {
		this.type = type;
		this.payload = payload;
		this.time = time;
	};

	return RefreshListener;
});