var Modal = function () {

    this.closeButton = null;
    this.modal = null;
    this.overlay = null;
    this.transitionEnd = transitionSelect();

    var defaults = {
        autoOpen: false,
        className: 'fade-and-drop',
        closeButton: true,
        content: "",
        maxWidth: 600,
        minWidth: 280,
        overlay: true
    }

    if (arguments[0] && typeof arguments[0] === "object") {
        this.options = extendDefaults(defaults, arguments[0]);
    }

    if (this.options.autoOpen === true) this.open();

}
// Open the model
Modal.prototype.close = function () {
    var _ = this;
    this.modal.className = this.modal.className.replace("fin-open", "");
    this.overlay.className = this.overlay.className.replace("fin-open", "");
    this.modal.addEventListener(this.transitionEnd, function () {
        _.modal.parentNode.removeChild(_.modal);
    });
    this.overlay.addEventListener(this.transitionEnd, function () {
        if (_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
    });
}



// Close the model
Modal.prototype.open = function (cb) {
    cb.call(this);
    initializeEvents.call(this);
    window.getComputedStyle(this.modal).height;
    this.modal.className = this.modal.className +
        (this.modal.offsetHeight > window.innerHeight ?
            " fin-open fin-anchored" : " fin-open");
    this.overlay.className = this.overlay.className + " fin-open";
}

function transitionSelect() {
    var el = document.createElement("div");
    if (el.style.WebkitTransition) return "webkitTransitionEnd";
    if (el.style.OTransition) return "oTransitionEnd";
    return 'transitionend';
}

function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            source[property] = properties[property];
        }
    }
    return source;
}

// Initialize close and overlay
function initializeEvents() {
    if (this.closeButton) {
        this.closeButton.addEventListener('click', this.close.bind(this));
    }
    if (this.overlay) {
        this.overlay.addEventListener('click', this.close.bind(this));
    }
}
export default Modal;