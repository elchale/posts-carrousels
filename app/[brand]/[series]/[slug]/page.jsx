import { notFound } from 'next/navigation'
import PostScreen from '../../../components/PostScreen'
import { getAllPosts, getBrands, getPost } from '../../../lib/data'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ brand: p.brand, series: p.series, slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { brand, series, slug } = await params
  const found = getPost(brand, series, slug)
  return { title: found ? `${found.post.title} · ${found.brand.name}` : 'Carruseles' }
}

export default async function Page({ params }) {
  const { brand: brandId, series, slug } = await params
  const found = getPost(brandId, series, slug)
  if (!found) notFound()
  const { post, brand } = found

  // Just enough of the brand's running order for the "siguiente pendiente" jump.
  const siblings = brand.posts.map((p) => ({
    id: p.id, brand: p.brand, series: p.series, slug: p.slug,
  }))

  /* Los posts que comparten fecha con este, en el orden de las marcas — la cola
   * del día. Es lo que mueve la flecha «siguiente de hoy» cuando llegas desde la
   * lista de hoy, y va en el HTML (no en la memoria del cliente) para que
   * también funcione si recargas la página a mitad de la tanda o abres el enlace
   * directo. Son cinco entradas de texto: la página sigue pesando lo mismo. */
  const names = Object.fromEntries(getBrands().map((b) => [b.id, b.name]))
  const sameDay = post.date
    ? getAllPosts()
      .filter((p) => p.date === post.date)
      .map((p) => ({
        id: p.id, brand: p.brand, series: p.series, slug: p.slug, brandName: names[p.brand] || p.brand,
      }))
    : []

  return (
    <PostScreen
      post={post}
      brand={{ id: brand.id, name: brand.name, tag: brand.tag }}
      siblings={siblings}
      sameDay={sameDay}
    />
  )
}
