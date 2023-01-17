import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore/lite'
import { WorkspaceElement } from '../pages/chords'
// import { getAnalytics } from "firebase/analytics"

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
