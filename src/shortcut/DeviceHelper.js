class DeviceHelper {

    static isIE() {
        if (!navigator.userAgent) {
            return false;
        }
        return Boolean(navigator.userAgent.match(/(Trident)/i));
    };

    static isEdge() {
        return !!navigator.userAgent && navigator.userAgent.indexOf("Edge") > -1;
    };

    static isMicrosoftBrowser() {
        return this.isEdge() || this.isIE();
    };
}

export default DeviceHelper;