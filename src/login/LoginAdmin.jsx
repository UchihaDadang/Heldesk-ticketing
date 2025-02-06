import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginAdmin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Mencoba login dengan:', { username, password });

            const response = await axios.post('http://localhost:3000/login', {
                username,
                password
            });

            console.log('Response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/admin/beranda');
                Swal.fire({
                    title: "Berhasil Login!",
                    timer: 1000,
                    showConfirmButton: false,
                    icon: "success",
                });     
            }

        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Login gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page d-flex align-items-center justify-content-center text-center" 
             style={{height: '100vh', backgroundColor: '#E9F1FA'}}>
            <div className="login-box p-3 rounded-2 d-flex shadow">
                <div className="h-100 w-100 m-0 p-3">
                    <h1>Login Admin</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box p-0 m-0">
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username" 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password" 
                                    required
                                    />
                            </div>
                            <button type="submit" className="btn btn-block btn-login" disabled={loading}>
                                {loading ? 'Loading...' : 'Login'}
                            </button>
                                {error && <div className="alert alert-danger">{error}</div>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginAdmin;