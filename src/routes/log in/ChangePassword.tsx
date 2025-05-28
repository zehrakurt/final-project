import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../signup/storage'; 
export default function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        old_password: '',
        password: '',
        password2: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.password2) {
            setError('Yeni şifreler eşleşmiyor.');
            setLoading(false);
            return;
        }

        try {
            const token = getAccessToken(); 
            if (!token) {
                setError('Lütfen önce giriş yapın.');
                navigate('/login');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'https://fe1111.projects.academy.onlyjs.com/api/v1/users/change-password',
                {
                    old_password: formData.old_password,
                    password: formData.password,
                    password2: formData.password2,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === 'success') {
                setSuccess('Şifreniz başarıyla değiştirildi! Ana sayfaya yönlendiriliyorsunuz...');
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError(response.data.message || 'Şifre değiştirme başarısız oldu.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Bir hata oluştu.';
            setError(errorMessage);
            console.error('Şifre değiştirme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hea-1">
            <div className="container flex flex-col justify-center items-center mx-auto">
                <div className="hea-2">
                    <h2 className="text-2xl font-bold mb-6 text-center">Şifreni Değiştir</h2>
                    <form onSubmit={handleSubmit}>
                        <p className="bth-1">*Mevcut Şifre</p>
                        <input
                            type="password"
                            className="inpt-2"
                            name="old_password"
                            value={formData.old_password}
                            onChange={handleChange}
                            required
                        />
                        <p className="bth-1">*Yeni Şifre</p>
                        <input
                            type="password"
                            className="inpt-2"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <p className="bth-1">*Yeni Şifre (Tekrar)</p>
                        <input
                            type="password"
                            className="inpt-2"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                        />

                        {error && <p className="error mt-4 text-red-500 text-sm text-center">{error}</p>}
                        {success && <p className="success mt-4 text-green-500 text-sm text-center">{success}</p>}

                        <button type="submit" className="imprt-4 mt-6" disabled={loading}>
                            {loading ? 'Şifre Değiştiriliyor...' : 'Şifreyi Değiştir'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}