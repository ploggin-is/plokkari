import { NextApiResponse } from 'next/types'

export default function handler(res: NextApiResponse) {
  res.status(200).json({ status: 'ok' })
}
