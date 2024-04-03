NodeList = window.NodeList;

//add each function to node list instead forEach
NodeList.prototype.each = function (callback) {
    this.forEach(function (elm, index) {
        callback.call(elm, elm, index);
    });
    return this;
};

//add all events to nodelist
["focusin", "focusout", "load", "beforeunload", "unload", "change", "click", "dblclick", "focus", "blur", "reset", "submit", "resize", "scroll", "mouseover", "mouseout", "mouseup", "mousedown", "mouseenter", "mousemove", "mouseleave", "contextmenu", "wheel", "keydown", "keypress", "keyup", "select"].forEach(function (name, index) {

    NodeList.prototype[name] = function (callback) {
        let sp = name.split(".")
        this.each(function (elm, index) {
            this.addEventListener(sp[0], callback);
        });
        return this;
    }

});

//on with name prevent dublicate event on objects
NodeList.prototype.on = function (event, callback) {
    const sp = event.split(".")
    return this.each(function (elm, index) {

        if (this.dataset?.eventName !== event)
            this.addEventListener(sp[0], callback);

        if (sp[1] != null) {
            this.dataset.eventName = event
        }
    });

}
