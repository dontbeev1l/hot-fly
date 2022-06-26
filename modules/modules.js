class ModulesLoader {
    constructor() {

    }

    loadModule(name, basepath) {
        if (!basepath) {
            basepath = './modules/'
        }

        const cssElement = document.createElement('link');
        cssElement.setAttribute('rel', 'stylesheet');
        cssElement.setAttribute('href', `${basepath}${name}/${name}.css`);
        document.head.appendChild(cssElement);

        const jsElement = document.createElement('script');
        jsElement.setAttribute('src', `${basepath}${name}/${name}.js`);
        document.body.appendChild(jsElement);

        return this;
    }


    onload(path) {
        const jsElement = document.createElement('script');
        jsElement.setAttribute('src', path);
        document.body.appendChild(jsElement);
    }
}