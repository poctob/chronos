export const environment = {
    production: false,

    MSALSettings: {
        config: {
            auth: {
                authority: 'https://login.microsoftonline.com/<your-tenant-id>',
                redirectUri: 'https://example.com',
                clientId: '<your-client-id>',
                postLogoutRedirectUri: 'https://example.com/logout',
                consentScopes: ["user.read", "api://<api-app-id>/access_application"]
            }
        },
        apiScopes: ["api://<api-app-id>/access_application"]
    },

    apiURL: '/api/'
}