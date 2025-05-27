// src/components/signup/Signup.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import '../log in/login.css';
import { register } from "./auth"; // Doğru import yolu

// Buradaki "toast" import'unu kaldırıyoruz!
// import { toast } from 'react-toastify'; 

// notistack'tan useSnackbar hook'unu import ediyoruz
import { useSnackbar } from 'notistack';

const api_key = import.meta.env.VITE_API_KEY; // Ortam değişkeninden API anahtarını al

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
    });

    const [loading, setLoading] = useState(false);

    // useSnackbar hook'unu burada çağırıyoruz
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 🔥 Eksik veya yanlış veri var mı kontrol et
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.password2) {
            // notistack ile hata bildirimi
            enqueueSnackbar("Lütfen tüm alanları doldurun.", { variant: 'error' });
            setLoading(false);
            return;
        }

        if (formData.password !== formData.password2) {
            // notistack ile hata bildirimi
            enqueueSnackbar("Şifreler uyuşmuyor.", { variant: 'error' });
            setLoading(false);
            return;
        }

        const registerData = {
            ...formData,
            password2: formData.password2,
            api_key: api_key,
        };

        const result = await register(registerData);

        if (result?.status === "success") { // API'nizin yanıt yapısına göre kontrol edin
            // notistack ile başarı bildirimi
            enqueueSnackbar("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.", { variant: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } else {
            // notistack ile hata bildirimi
            enqueueSnackbar(result?.message || "Kayıt başarısız.", { variant: 'error' });
        }

        setLoading(false);
    };

    return (
        <div className="hea-1">
            <div className="container flex flex-col justify-center items-center mx-auto">
                <div className="flex">
                    <Link to="/login"><button className="s-lgn mr-8">Giriş Yap</button></Link>
                    <button className="log-butn btn">Üye Ol</button>
                </div>

                <form className="hea-2" onSubmit={handleSubmit}>
                    <div className="flex-row">
                        <div>
                            <p className="four">Ad</p>
                            <input className="input-2" type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <p className="four">Soyad</p>
                            <input className="input-2" type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                        </div>
                    </div>

                    <p className="four">E-Posta</p>
                    <input type="email" className="inp-3" name="email" value={formData.email} onChange={handleChange} required />

                    <p className="four">Şifre</p>
                    <input type="password" className="inp-3" name="password" value={formData.password} onChange={handleChange} required />

                    <p className="four">Şifre Tekrar</p>
                    <input type="password" className="inp-3" name="password2" value={formData.password2} onChange={handleChange} required />

                    <button className="imprt-4" type="submit" disabled={loading}>
                        {loading ? 'Kayıt Oluyor...' : 'Üye Ol'}
                    </button>

                    <p className="alry">
                        Zaten hesabınız var mı? <Link className="grş-1" to="/login">Giriş Yap</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}