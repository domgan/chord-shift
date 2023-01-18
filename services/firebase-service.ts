import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore/lite'
import { WorkspaceElement } from '../pages/chords'
// import { getAnalytics } from "firebase/analytics"

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}


export default class FirebaseService {
  db: Firestore

  constructor() {
    this.db = getFirestore(initializeApp(firebaseConfig))
  }

  async getWorkspace(id: string): Promise<WorkspaceElement[]> {
    const workoutDocRef = doc(this.db, 'workspaces', id)
    const workoutDocSnap = await getDoc(workoutDocRef)

    return workoutDocSnap.data()?.workspace
  }

  async setWorkspace(id: string, workspace: WorkspaceElement[]): Promise<void> {
    const workoutDocRef = doc(this.db, 'workspaces', id)
    await setDoc(workoutDocRef, { workspace })
  }
}
