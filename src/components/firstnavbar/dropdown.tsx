import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import './dropdown.css';
import { Link } from "react-router-dom";
import { getMyProfile } from "../../routes/signup/auth";
import { getAccessToken, removeTokens } from "../../routes/signup/storage";

interface UserProfile {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
}

export default function Dropdown() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = getAccessToken();
    const isLoggedIn = !!token;

    useEffect(() => {
        const fetchProfile = async () => {
            if (isLoggedIn) {
                setLoading(true);
                setError(null);
                try {
                    const profileData = await getMyProfile();
                    console.log("Dropdown içinde gelen profil verisi:", profileData); // Bunu ekledim
                    if (profileData) {
                        setProfile(profileData.data); // .data ekledim
                    } else {
                        setError("Profil bilgileri alınamadı.");
                        setProfile(null); //state sıfırladım
                    }
                } catch (error: any) {
                    setError(error.message || "Profil verisi alınırken bir hata oluştu.");
                    setProfile(null);  //state sıfırladım
                } finally {
                    setLoading(false);
                }
            } else {
                setProfile(null);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    let displayName = "HESAP";
    if (loading) {
        displayName = "Yükleniyor...";
    } else if (error) {
        displayName = "Hata";
    }
    else if (profile?.first_name) {
        displayName = profile.first_name.toUpperCase();
    } else if (profile?.username) {
        displayName = profile.username;
    }

    return (
        <Menu as="div" className="relative drop-5 inline-block text-left">
            <div>
                <MenuButton className="inline-flex no-ring-offset w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <div className="menu-button-content">
                        <img src="/images/Rectangle2.png" alt="Hesap" />
                        <span>{displayName}</span>
                        <img className='drp-img' src="/images/Rectangle.png" alt="Açılır Menü" />
                    </div>
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="py-1">
                    {isLoggedIn ? (
                        <>
                            <MenuItem>
                                <Link
                                    className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                                    to={`/profile`}
                                >
                                    Profilim
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        removeTokens();
                                        window.location.reload();
                                    }}
                                >
                                    Çıkış Yap
                                </button>
                            </MenuItem>
                        </>
                    ) : (
                        <>
                            <MenuItem>
                                <Link
                                    className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                                    to="/login"
                                >
                                    Giriş Yap
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Link
                                    className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                                    to="/signup"
                                >
                                    Üye Ol
                                </Link>
                            </MenuItem>
                        </>
                    )}
                </div>
            </MenuItems>
        </Menu>
    );
}
