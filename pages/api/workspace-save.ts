// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseService from '../../services/firebase-service';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const firebaseService = FirebaseService.getInstance()
  const id = request.body.id
  const workspace = request.body.workspace
  await firebaseService.setWorkspace(id, workspace)
  response.status(201).json('todo')
}
