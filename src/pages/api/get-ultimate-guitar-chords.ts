import { NextApiRequest, NextApiResponse } from 'next'
import extractChords from '../../services/ultimate-guitar-service'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const url: string = decodeURI(request.query.url!.toString())
  const chords = await extractChords(url)
  response.status(200).send({ chords })
}
