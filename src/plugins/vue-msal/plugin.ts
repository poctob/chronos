import * as Msal from 'msal'


export default class VueMsalPlugin {

    msalInstance: Msal.UserAgentApplication;

    static installed = false;

    static install(Vue: any, options: Msal.Configuration) {
        const plugin = new VueMsalPlugin(Vue, options)
        Vue.prototype.msal = plugin.msalInstance;
    }

    constructor(Vue: any, options: Msal.Configuration) {
        this.msalInstance = new Msal.UserAgentApplication(options);

        this.msalInstance.handleRedirectCallback((error, response) => {
            if (error) {
                console.error("Redirect error: ", error);
                return;
            }
            console.log("Redirect success: ", response);
        });
    }

}