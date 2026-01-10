import type { FirebaseOptions} from 'firebase/app';
import { getApp, initializeApp } from 'firebase/app'
import type {
  Firestore} from 'firebase/firestore/lite';
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore/lite'
import type { WorkspaceElement } from '@/types/workspace'

export default class FirebaseService {
  private static instance: FirebaseService
  private db!: Firestore

  static getInstance(): FirebaseService {
    if (!this.instance) {
      this.instance = new FirebaseService()
    }
    return this.instance
  }

  private initializeFirebaseApp() {
    const firebaseConfig: FirebaseOptions = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    }

    try {
      getApp('chord-shift')
    } catch {
      initializeApp(firebaseConfig, 'chord-shift')
    }

    this.db = getFirestore(getApp('chord-shift'))
  }

  async getWorkspace(id: string): Promise<WorkspaceElement[] | null> {
    if (!this.db) this.initializeFirebaseApp()
    const workspaceDocRef = doc(this.db, 'workspaces', id)
    const workspaceDocSnap = await getDoc(workspaceDocRef)
    return workspaceDocSnap.data()?.workspace ?? null
  }

  async setWorkspace(id: string, workspace: WorkspaceElement[]): Promise<void> {
    if (!this.db) this.initializeFirebaseApp()
    const workspaceDocRef = doc(this.db, 'workspaces', id)
    await setDoc(workspaceDocRef, { workspace })
  }
}
