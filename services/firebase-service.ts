import {FirebaseOptions, getApp, initializeApp} from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore/lite'
import { WorkspaceElement } from '../pages/chords'
// import { getAnalytics } from "firebase/analytics"

export default class FirebaseService {
  static instance: FirebaseService;
  private db!: Firestore;

  static getInstance(): FirebaseService {
    if (!this.instance) this.instance = new FirebaseService();
    return this.instance;
  }

  initializeFirebaseApp() {
    const firebaseConfig: FirebaseOptions = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };
    initializeApp(firebaseConfig, 'chord-shift');
    this.db = getFirestore(getApp('chord-shift'));
  }

  async getWorkspace(id: string): Promise<WorkspaceElement[]> {
    if (!this.db) this.initializeFirebaseApp()
    const workoutDocRef = doc(this.db, 'workspaces', id)
    const workoutDocSnap = await getDoc(workoutDocRef)
    return workoutDocSnap.data()?.workspace
  }

  async setWorkspace(id: string, workspace: WorkspaceElement[]): Promise<void> {
    if (!this.db) this.initializeFirebaseApp()
    const workoutDocRef = doc(this.db, 'workspaces', id)
    await setDoc(workoutDocRef, { workspace })
  }
}
