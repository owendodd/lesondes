import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const DOC_ID = 'budgetState'

export async function GET() {
  const doc = await client.fetch<{ stateJson?: string } | null>(
    `*[_type == "budgetState" && _id == $id][0]{ stateJson }`,
    { id: DOC_ID },
  )
  if (!doc?.stateJson) return NextResponse.json(null)
  return NextResponse.json(JSON.parse(doc.stateJson))
}

export async function POST(req: Request) {
  const body = await req.json()
  await client.createOrReplace({
    _type: 'budgetState',
    _id: DOC_ID,
    stateJson: JSON.stringify(body),
  })
  return NextResponse.json({ ok: true })
}
