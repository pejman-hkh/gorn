
NodeList = window.NodeList;
export { };

declare global {
    interface NodeList {
        each: (callback: any) => NodeList;
        on: (event: string, callback: any) => NodeList;
        focusin: (callback: any) => NodeList;
        focusout: (callback: any) => NodeList;
        load: (callback: any) => NodeList;
        beforeunload: (callback: any) => NodeList;
        unload: (callback: any) => NodeList;
        change: (callback: any) => NodeList;
        click: (callback: any) => NodeList;
        dblclick: (callback: any) => NodeList;
        focus: (callback: any) => NodeList;
        blur: (callback: any) => NodeList;
        reset: (callback: any) => NodeList;
        submit: (callback: any) => NodeList;
        resize: (callback: any) => NodeList;
        scroll: (callback: any) => NodeList;
        mouseover: (callback: any) => NodeList;
        mouseout: (callback: any) => NodeList;
        mouseup: (callback: any) => NodeList;
        mousedown: (callback: any) => NodeList;
        mouseenter: (callback: any) => NodeList;
        mousemove: (callback: any) => NodeList;
        mouseleave: (callback: any) => NodeList;
        contextmenu: (callback: any) => NodeList;
        wheel: (callback: any) => NodeList;
        keydown: (callback: any) => NodeList;
        keypress: (callback: any) => NodeList;
        keyup: (callback: any) => NodeList;
        select: (callback: any) => NodeList;
    }
}

//add each function to node list instead forEach
NodeList.prototype.each = function (callback: any): NodeList {
    this.forEach(function (elm, index) {
        callback.call(elm, elm, index);
    });
    return this;
};

//add all events to nodelist
["focusin", "focusout", "load", "beforeunload", "unload", "change", "click", "dblclick", "focus", "blur", "reset", "submit", "resize", "scroll", "mouseover", "mouseout", "mouseup", "mousedown", "mouseenter", "mousemove", "mouseleave", "contextmenu", "wheel", "keydown", "keypress", "keyup", "select"].forEach(function (name: string) {

    (NodeList.prototype as { [key: string]: any })[name] = function (this:any, callback: any) {
        let sp = name.split(".")
        this.each(function (this: any) {
            this.addEventListener(sp[0], callback);
        });
        return this;
    };

});

//on with name prevent dublicate event on objects
NodeList.prototype.on = function (event, callback) {
    const sp = event.split(".")
    return this.each(function (this: any) {
        if (this.dataset?.eventName !== event)
            this.addEventListener(sp[0], callback);

        if (sp[1] != null) {
            this.dataset.eventName = event
        }
    });

}
