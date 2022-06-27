class ModulesLoader {
    constructor() {
        this.scriptsCount = 0;
        this.loadedCount = 0;
    }

    loadModule(name, basepath) {
        if (!basepath) {
            basepath = './modules/'
        }

        this.scriptsCount++;

        const cssElement = document.createElement('link');
        cssElement.setAttribute('rel', 'stylesheet');
        cssElement.setAttribute('href', `${basepath}${name}/${name}.css`);
        document.head.appendChild(cssElement);

        const jsElement = document.createElement('script');
        jsElement.onload = () => {
            this.loadedCount++;
            this.checkLoaded();
        }
        jsElement.setAttribute('src', `${basepath}${name}/${name}.js`);
        document.body.appendChild(jsElement);

        return this;
    }


    onload(path) {
        this.onloadFn = () => {
            const jsElement = document.createElement('script');
            jsElement.setAttribute('src', path);
            document.body.appendChild(jsElement);
        }

        this.checkLoaded();
    }

    checkLoaded() {
        if (this.scriptsCount === this.loadedCount && this.onloadFn) {
            this.onloadFn();
        }
    }
}