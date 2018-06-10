class IEFileDownLoader {
    requiredFeaturesSupported() {
        return (this.BlobConstructor() && this.msSaveOrOpenBlobSupported());
    }

    BlobConstructor() {
        if (!window.Blob) {
            console.log('msSaveOrOpenBlob Not Supported');
            return false;
        } // if

        return true;
    }

    msSaveOrOpenBlobSupported() {
        if (!window.navigator.msSaveOrOpenBlob) {
            console.log('msSaveOrOpenBlob Not Supported');
        }
        return true;
    }

    static saveFile(data) {
        // if (this.requiredFeaturesSupported()) {
            let fileData = [data];
           let blobObject = new Blob(fileData);
            window.navigator.msSaveOrOpenBlob(blobObject, 'shortcut.txt');
        // }
    }
}

export default IEFileDownLoader;