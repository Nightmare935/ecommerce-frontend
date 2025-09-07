import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Listing from './pages/Listing.jsx'
import Cart from './pages/Cart.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function Nav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto p-4 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-indigo-700">ShopSwift</Link>
        <nav className="ml-auto flex items-center gap-3">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/cart" className="hover:underline">Cart</Link>
          {user ? (
            <button className="btn" onClick={() => { logout(); navigate('/login') }}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/signup" className="btn bg-gray-900">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Listing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <footer className="text-center text-sm text-gray-500 py-10">© {new Date().getFullYear()} ShopSwift</footer>
    </AuthProvider>
  )
}
