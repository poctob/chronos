import VueMsalPlugin from './plugin'
import * as Msal from 'msal'

declare module 'vue/types/vue' {
  interface Vue {
    msal: Msal.UserAgentApplication;
  }

  interface VueConstructor {
    msal: Msal.UserAgentApplication;
  }
}


export default VueMsalPlugin