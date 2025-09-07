import { useEffect, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const [cart, setCart] = useState({ items: [] })
  const { user } = useAuth()

  async function load() {
    const { data } = await api.get('/api/cart')
    setCart(data || { items: [] })
  }
  useEffect(() => { if (user) load() }, [user])

  async function add(itemId) { await api.post('/api/cart/add', { itemId, qty: 1 }); load() }
  async function remove(itemId) { await api.post('/api/cart/remove', { itemId, qty: 1 }); load() }

  const total = (cart.items || []).reduce((s, ci) => s + (ci.item?.price || 0) * ci.qty, 0)

  if (!user) return <p className="mt-6 text-center">Please login to view your cart.</p>

  return (
    <div className="max-w-3xl mx-auto mt-6 card">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {(cart.items || []).map(ci => (
          <div key={ci.item._id} className="flex items-center gap-3">
            <img src={ci.item.imageUrl} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <div className="font-medium">{ci.item.title}</div>
              <div className="text-sm text-gray-600">₹{ci.item.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn" onClick={()=>remove(ci.item._id)}>-</button>
              <div className="w-10 text-center">{ci.qty}</div>
              <button className="btn" onClick={()=>add(ci.item._id)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center border-t mt-4 pt-4">
        <div className="text-lg font-semibold">Total: ₹{total}</div>
        <button className="btn">Checkout</button>
      </div>
    </div>
  )
}
