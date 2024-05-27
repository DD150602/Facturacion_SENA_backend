import 'dotenv/config'

export const PORT = process.env.PORT
export const DATABASE_HOST = process.env.DATABASE_HOST
export const DATABASE_USER = process.env.DATABASE_USER
export const DATABASE_PORT = process.env.DATABASE_PORT
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
export const DATABASE_NAME = process.env.DATABASE_NAME
export const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
}
