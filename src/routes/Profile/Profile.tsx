import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile, UpdateMyProfile } from '../signup/auth';
import { FetchWithAuth } from '../signup/api-client';
import './Profile.css'; 
import { TextInput, Button, Group, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 



interface UserProfile {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
}


interface Address {
    id: number;
    title: string;
    address: string;
    city: string;
    country: string;
}

interface OrderFromBackend {
    order_no: string;
    order_status: string;
    created_at: string;
    total_price: number;
    cart_detail: any[];
}


interface AllOrderTypes {
    status: string;
    data: OrderFromBackend[];
    message?: string; 
}

const Profile: React.FC = () => {
    // State tanımlamaları
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [orders, setOrders] = useState<OrderFromBackend[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorProfile, setErrorProfile] = useState<string | null>(null);
    const [errorAddresses, setErrorAddresses] = useState<string | null>(null);
    const [errorOrders, setErrorOrders] = useState<string | null>(null);

  
    const [profileForm, setProfileForm] = useState<UserProfile>({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });

    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(profile?.phone_number);

    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);


    const isMobile = useMediaQuery('(max-width: 768px)');


    useEffect(() => {
        const fetchProfileData = async () => {
            setLoadingProfile(true);
            setErrorProfile(null);
            try {
                const profileData = await getMyProfile();
                console.log("Profile içinde gelen profil verisi", profileData);
                if (profileData && profileData.data) {
                    setProfile(profileData.data);
                    setProfileForm({
                        first_name: profileData.data?.first_name || '',
                        last_name: profileData.data?.last_name || '',
                        email: profileData.data?.email || '',
                        phone_number: profileData.data?.phone_number || '',
                    });
                    setPhoneNumber(profileData.data?.phone_number);
                } else {
                    setErrorProfile("Profil bilgileri alınamadı veya boş geldi.");
                    setProfile(null);
                }
            } catch (error: any) {
                setErrorProfile("Profil bilgileri yüklenirken bir hata oluştu: " + error.message);
                setProfile(null);
            } finally {
                setLoadingProfile(false);
            }
        };

        const fetchAddresses = async () => {
            setLoadingAddresses(true);
            setErrorAddresses(null);
            try {
                const response = await FetchWithAuth('/users/addresses?limit=10&offset=0');
                const data = await response.json();
                setAddresses(data.data);
            } catch (error: any) {
                setErrorAddresses("Adresler yüklenirken bir hata oluştu: " + error.message);
            } finally {
                setLoadingAddresses(false);
            }
        };

        const fetchOrders = async () => {
            setLoadingOrders(true);
            setErrorOrders(null);
            try {
                const response = await FetchWithAuth('/orders');
                const data = await response.json() as AllOrderTypes;

                if (data.status === "success") {
                    setOrders(data.data);
                } else {
                    setErrorOrders("Siparişler yüklenirken bir hata oluştu: " + (data.message || ""));
                }
            } catch (error: any) {
                setErrorOrders("Siparişler yüklenirken bir hata oluştu: " + error.message);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchProfileData();
        fetchAddresses();
        fetchOrders();
    }, []); 

   
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };


    const handlePhoneNumberChange = (value: string | undefined) => {
        setProfileForm({ ...profileForm, phone_number: value });
        setPhoneNumber(value);
        console.log('Telefon Numarası:', value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateSuccess(null);
        setUpdateError(null);
        try {
            const updatedData = await UpdateMyProfile(profileForm);
            console.log("Profil güncelleme cevabı:", updatedData);
            if (updatedData && updatedData.data) {
                setProfile(updatedData.data);
                setProfileForm({
                    first_name: updatedData.data.first_name || '',
                    last_name: updatedData.data.last_name || '',
                    email: updatedData.data.email || '',
                    phone_number: updatedData.data.phone_number || '',
                });
                setPhoneNumber(updatedData.data.phone_number);
                setUpdateSuccess("Profil başarıyla güncellendi!");
            } else {
                setUpdateError("Profil güncelleme cevabı beklenenden farklı.");
            }
        } catch (error: any) {
            setUpdateError("Profil bilgileri güncellenirken bir hata oluştu: " + error.message);
        }
    };

    return (
        <div className='container mx-auto'>
            <div className="grid grid-cols-[2fr_10fr] gap-8">
   
                <div className="profile-header-container">
                    <div className="profile-links-container">
                        <Link to="/profile" className="profile-title-link profile-link-item">
                            <img
                                src="/images/13.png" 
                                alt="Hesabım İkonu"
                                className="profile-title-icon"
                            />
                            <p className="profile-section-title">Hesabım</p>
                        </Link>
                        <Link to="/orders" className="profile-title-link profile-link-item">
                            <img
                                src="/images/14.png" 
                                alt="Siparişlerim İkonu"
                                className="profile-title-icon"
                            />
                            <p className="profile-section-title">Siparişlerim</p>
                        </Link>
                        <Link to="/add-address" className="profile-title-link profile-link-item">
                            <img
                                src="/images/15.png" 
                                alt="Adreslerim İkonu"
                                className="profile-title-icon"
                            />
                            <p className="profile-section-title">Adreslerim</p>
                        </Link>
                        
                        <Link to="/change-password" className="profile-title-link profile-link-item">
                            <svg className="profile-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <p className="profile-section-title">Şifre Değiştir</p>
                        </Link>
                    </div>
                </div>
                
                <div className="account-info-container">
                    <p className='account-info-title a2'>Hesap Bilgilerim</p>
     
                    {updateSuccess && <div className="text-green-500 mb-4">{updateSuccess}</div>}
                    {updateError && <div className="text-red-500 mb-4">{updateError}</div>}
                    <form onSubmit={handleSubmit}>
                        <Stack spacing="md">
                            <Group grow>
                  
                                <TextInput
                                    label="Ad"
                                    placeholder="Adınızı girin"
                                    name="first_name"
                                    value={profileForm.first_name?.toUpperCase() || ''}
                                    onChange={handleInputChange}
                                    classNames={{ input: 'mantine-TextInput-input', label: 'mantine-TextInput-label' }}
                                />
                  
                                <TextInput
                                    label="Soyad"
                                    placeholder="Soyadınızı girin"
                                    name="last_name"
                                    value={profileForm.last_name?.toUpperCase() || ''}
                                    onChange={handleInputChange}
                                    classNames={{ input: 'mantine-TextInput-input', label: 'mantine-TextInput-label' }}
                                />
                            </Group>
                         
                            <TextInput
                                label="Telefon"
                                placeholder="Telefon numaranızı girin"
                                name="phone_number"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange} 
                                component={PhoneInput} 
                                country="TR" 
                                classNames={{ input: 'PhoneInput', label: 'mantine-TextInput-label' }}
                            />
                           
                            <TextInput
                                label="Email"
                                placeholder="Email adresiniz"
                                name="email"
                                value={profileForm.email?.toUpperCase() || ''}
                                onChange={handleInputChange} 
                                readOnly 
                                classNames={{ input: 'mantine-TextInput-input', label: 'mantine-TextInput-label' }}
                            />
                           
                            <div className="save-button-container">
                                <Button type="submit" className="save-button">
                                    Kaydet
                                </Button>
                            </div>
                        </Stack>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;