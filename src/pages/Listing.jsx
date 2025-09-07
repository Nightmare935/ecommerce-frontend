import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Listing() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const categories = useMemo(() => {
    const c = new Set(items.map(i=>i.category).filter(Boolean))
    return ['', ...Array.from(c)]
  }, [items])

  async function fetchItems() {
    setLoading(true)
    const params = {}
    if (q) params.q = q
    if (category) params.category = category
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    const { data } = await api.get('/api/items', { params })
    setItems(data); setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  async function addToCart(id) {
    if (!user) return alert('Please login first')
    await api.post('/api/cart/add', { itemId: id, qty: 1 })
    alert('Added to cart')
  }

  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <aside className="col-span-12 md:col-span-3 card">
        <h2 className="font-semibold mb-3">Filters</h2>
        <div className="space-y-2">
          <input className="w-full border rounded-xl p-2" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
          <select className="w-full border rounded-xl p-2" value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c || 'All categories'}</option>)}
          </select>
          <div className="flex gap-2">
            <input className="w-full border rounded-xl p-2" placeholder="Min price" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
            <input className="w-full border rounded-xl p-2" placeholder="Max price" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
          </div>
          <button className="btn w-full" onClick={fetchItems}>Apply</button>
        </div>
      </aside>
      <section className="col-span-12 md:col-span-9">
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(it => (
              <div key={it._id} className="card flex flex-col">
                <img src={it.imageUrl} alt={it.title} className="rounded-xl object-cover h-40 w-full mb-3" />
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{it.description}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="font-bold">₹{it.price}</span>
                  <button className="btn" onClick={() => addToCart(it._id)}>Add to cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
