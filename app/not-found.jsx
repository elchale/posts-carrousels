import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="empty" style={{ paddingTop: 120 }}>
      <b>Esa página no existe</b>
      Puede que el post se haya renombrado al re-renderizar.
      <div style={{ marginTop: 18 }}>
        <Link className="chip" href="/">Volver al inicio</Link>
      </div>
    </div>
  )
}
