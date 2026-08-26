import { notFound } from 'next/navigation'
import BrandScreen from '../components/BrandScreen'
import { getBrand, getBrands, summarize } from '../lib/data'

export const dynamicParams = false

export function generateStaticParams() {
  return getBrands().map((b) => ({ brand: b.id }))
}

export async function generateMetadata({ params }) {
  const { brand: brandId } = await params
  const brand = getBrand(brandId)
  return { title: brand ? `${brand.name} · Carruseles` : 'Carruseles' }
}

export default async function Page({ params }) {
  const { brand: brandId } = await params
  const brand = getBrand(brandId)
  if (!brand) notFound()

  return (
    <BrandScreen
      brand={{ id: brand.id, name: brand.name, tag: brand.tag, label: brand.label, series: brand.series }}
      posts={brand.posts.map(summarize)}
    />
  )
}
