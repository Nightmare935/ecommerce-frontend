import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    try {
      await signup(name, email, password)
    } catch (e) {
      setErr(e?.response?.data?.error || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border rounded-xl p-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border rounded-xl p-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-xl p-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full">Signup</button>
      </form>
    </div>
  )
}
