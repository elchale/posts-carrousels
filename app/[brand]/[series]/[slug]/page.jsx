import { notFound } from 'next/navigation'
import PostScreen from '../../../components/PostScreen'
import { getAllPosts, getPost } from '../../../lib/data'

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

  return (
    <PostScreen
      post={post}
      brand={{ id: brand.id, name: brand.name, tag: brand.tag }}
      siblings={siblings}
    />
  )
}
