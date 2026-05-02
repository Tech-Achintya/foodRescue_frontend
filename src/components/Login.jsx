import { useState } from 'react';
import { post } from '../api';
import backgroundImg from '../assets/Images/backGround_login.jpg';
import logoImg from '../assets/Images/Logo_login.jpg';


export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // "login" or "register"
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('MESS');

  const submit = async (e) => {
    e.preventDefault();

    if (!contact.trim() || !role) {
      alert('Please enter contact and role');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      alert('Please enter name to register');
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = { name: name.trim(), contact: contact.trim(), role };
      const res = await post(endpoint, payload);

      console.log(`${mode} response:`, res);

      if (res.error) {
        alert(res.error);
        return;
      }

      if (mode === 'register') {
        alert('Registration successful — you can now log in.');
        setMode('login');
      } else {
        onLogin(res);
      }
    } catch (err) {
      console.error(`${mode} failed:`, err);
      alert('Something went wrong. Check console.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logoImg} alt="Save N Serve" className="w-100 h-35" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {mode === 'login' ? 'Login' : 'Register'} ({role})
        </h2>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact Number"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="MESS">Mess Head</option>
            <option value="NGO">NGO User</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center mt-4 text-sm text-gray-700">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-green-700 font-semibold underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-green-700 font-semibold underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
