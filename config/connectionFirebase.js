import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { firebaseConfig } from './envVariables.js'

initializeApp(firebaseConfig)
export const storage = getStorage()
