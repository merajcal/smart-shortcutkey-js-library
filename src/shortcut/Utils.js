class Utils {
    static isIE() {
        // Internet Explorer 6-11
        return /*@cc_on!@*/false || !!document.documentMode;
    }

    static isEdge() {
        // Edge 20+
        //return !isIE && !!window.StyleMedia;
    }
}

export default Utils;