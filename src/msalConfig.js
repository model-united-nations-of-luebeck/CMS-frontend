import { PublicClientApplication} from '@azure/msal-browser'
import { reactive } from 'vue'

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID, 
    authority: import.meta.env.VITE_AZURE_AD_AUTHORITY,
    redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI,
    postLogoutRedirectUri: import.meta.env.VITE_AZURE_AD_POST_LOGOUT_REDIRECT_URI
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false
  }
}
export const graphScopes = {
  scopes: ['user.read', 'openid', 'profile']
}
export const state = reactive({
  isAuthenticated: false,
  user: null
})

export const msalInstance = new PublicClientApplication(msalConfig)
