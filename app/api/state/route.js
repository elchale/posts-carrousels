import { clearState, isConfigured, mergeState, readState } from '../../lib/db'

// Nunca cachear: es estado mutable de una sola persona.
export const dynamic = 'force-dynamic'
export const revalidate = 0

/** 200 con `configured:false` en vez de 500: sin base de datos la app sigue
 *  funcionando solo con el navegador, y el cliente necesita saberlo para decirlo
 *  en pantalla en vez de fingir que guardó algo. */
function notConfigured() {
  return Response.json({ configured: false, v: 1, posts: {} })
}

export async function GET() {
  if (!isConfigured()) return notConfigured()
  try {
    return Response.json({ configured: true, ...(await readState()) })
  } catch (e) {
    return Response.json({ configured: true, error: e.message, v: 1, posts: {} }, { status: 503 })
  }
}

export async function PUT(request) {
  if (!isConfigured()) return notConfigured()
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }
  if (!body || typeof body.posts !== 'object' || body.posts === null) {
    return Response.json({ error: 'Falta "posts"' }, { status: 400 })
  }
  try {
    return Response.json({ configured: true, ...(await mergeState(body.posts)) })
  } catch (e) {
    return Response.json({ configured: true, error: e.message }, { status: 503 })
  }
}

export async function DELETE() {
  if (!isConfigured()) return notConfigured()
  try {
    return Response.json({ configured: true, ...(await clearState()) })
  } catch (e) {
    return Response.json({ configured: true, error: e.message }, { status: 503 })
  }
}
