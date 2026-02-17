import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios"


const Login = ({setUser}) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // ✅ Make async
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password
      })
      localStorage.setItem("token",data.token)
      setUser(data);
      console.log(data);

      // ✅ redirect after login
      navigate("/")

    } catch (err) {
      setError(err.response?.data?.message || "wrong credential")
    }
  }

  return (
    <div className='container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md'>
      
      <h2 className='text-2xl font-semibold mb-6 text-center'>Login</h2>

      {error && (
        <p className='text-red-500 mb-4 text-center'>{error}</p>
      )}

      {/* ✅ Attach handler here */}
      <form className='space-y-4' onSubmit={handleSubmit}>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
            className='w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400'
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
            className='w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400'
          />
        </div>

        <button
          type="submit"
          className='w-full h-10 bg-blue-500 text-white rounded-md hover:bg-blue-700'
        >
          Login
        </button>

      </form>

      <p className='mt-4 text-center'>
        Don’t have an account?{" "}
        <Link className='text-blue-600 hover:underline' to="/register">
          Register
        </Link>
      </p>

    </div>
  )
}

export default Login
