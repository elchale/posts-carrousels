import HomeScreen from './components/HomeScreen'
import { getBrands, summarize } from './lib/data'

export default function Page() {
  const brands = getBrands().map((b) => ({
    id: b.id,
    name: b.name,
    tag: b.tag,
    label: b.label,
    posts: b.posts.map(summarize),
  }))
  const total = brands.reduce((n, b) => n + b.posts.length, 0)
  const slides = brands.reduce((n, b) => n + b.posts.reduce((m, p) => m + p.slides, 0), 0)
  return <HomeScreen brands={brands} total={total} slides={slides} />
}
