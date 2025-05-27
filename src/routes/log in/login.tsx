// src/components/Login/Login.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../signup/auth';
import { setTokens } from '../signup/storage';
import { useCartStore } from '../../store/sepet';
import { ToastContainer, toast } from 'react-toastify'; // Toastify bileşenlerini import ediyoruz
import 'react-toastify/dist/ReactToastify.css'; // Toastify stil dosyasını import ediyoruz
import './login.css';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    // Artık error ve success state'lerine ihtiyacımız yok, çünkü toast kullanacağız.
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');
    const setIsLoggedIn = useCartStore((state) => state.setIsLoggedIn);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // setError(''); // Kaldırıldı
        // setSuccess(''); // Kaldırıldı

        try {
            const response = await login(formData.username, formData.password);
            if (response && response.access_token) {
                // Başarı durumunda toast mesajı gösteriyoruz
                toast.success('Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...', {
                    position: "top-right",
                    autoClose: 2000, // 2 saniye sonra otomatik kapanır
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTokens(response.access_token, response.refresh_token);
                setIsLoggedIn(true);
                setTimeout(() => navigate('/'), 2000); // Toast kapanma süresiyle eşleşmesi iyi olur
            } else {
                // Hata durumunda toast mesajı gösteriyoruz
                const errorMessage = response?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Bir hata oluştu.';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error('Giriş hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hea-1">
            <div className="container flex flex-col justify-center items-center mx-auto">
                <div className="flex">
                    <button className="log-butn mr-4">Giriş Yap</button>
                    <Link to="/signup">
                        <button className="s-lgn">Üye Ol</button>
                    </Link>
                </div>
                <div className="hea-2">
                    <p className="bth-1">*E-Posta veya Kullanıcı Adı</p>
                    <input
                        type="text"
                        className="inpt-2"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <p className="bth-1">*Şifre</p>
                    <input
                        type="password"
                        className="inpt-2"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Link to="/change-password" className="frgt-1">
                        Şifremi Unuttum?
                    </Link>
                    {/* Artık error ve success p etiketlerine ihtiyacımız yok */}
                    {/* {error && <p className="error">{error}</p>} */}
                    {/* {success && <p className="success">{success}</p>} */}
                    <button className="imprt-4" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </div>
            </div>
            <ToastContainer /> {/* Toast mesajlarının gösterileceği yer */}
        </div>
    );
}