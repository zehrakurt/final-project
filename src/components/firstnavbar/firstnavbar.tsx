import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';

import Dropdown from './dropdown';
import Mobilenavbar from './mobilenavbar';

import { useCartStore, CartItem } from '../../store/sepet';
import './firstnavbar.css';

export interface Product {
    id: number;
    name: string;
    photo_src: string;
    price_info: {
        discounted_price: number;
        total_price: number;
    };
    slug: string;
    short_explanation: string;
    average_star: number;
    comment_count: number;
}

const BASE_URL = 'https://fe1111.projects.academy.onlyjs.com';


export default function Firstnavbar() {
    const bears = useCartStore((state) => state.bears);
    const removeBearFromStore = useCartStore((state) => state.removeBear);
    const increaseBearCountInStore = useCartStore((state) => state.increaseBearCount);
    const isLoggedIn = useCartStore((state) => state.isLoggedIn);
    const getCartFromBackend = useCartStore((state) => state.getCartFromBackend);

    const [openedMainDrawer, { open: openMainDrawer, close: closeMainDrawer }] = useDisclosure(false);
    const [cartLoaded, setCartLoaded] = useState(false);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isLoggedIn) {
            getCartFromBackend().then(() => setCartLoaded(true));
        } else {
            setCartLoaded(true);
        }
    }, [isLoggedIn, getCartFromBackend]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('.navbar-search-wrapper')) {
          setIsSearchActive(false);
        }
      };

      if (isSearchActive) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isSearchActive]);

    const handleCloseDrawer = () => {
        closeMainDrawer();
    };

    const handleCheckout = () => {
        if (isLoggedIn) {
            handleCloseDrawer();
            navigate('/payment');
        } else {
            alert('Ödeme işlemine devam etmek için lütfen giriş yapın.');
            navigate('/login');
        }
    };

    const handleRemoveFromCart = (bear: CartItem) => {
        removeBearFromStore(bear);
    };

    const handleIncreaseQuantity = (bear: CartItem) => {
        increaseBearCountInStore(bear);
    };

    const calculateTotalPrice = useMemo(() => {
        return bears.reduce((total, bear) => total + (bear.total_price || bear.price * bear.count || 0), 0);
    }, [bears]);

    const totalItemCount = bears.reduce((sum, item) => sum + item.count, 0);

    const fetchSearchResults = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            setIsSearchActive(false);
            return;
        }

        setSearchLoading(true);
        setIsSearchActive(true);

        try {
            console.log("API İstek URL'si:", `${BASE_URL}/api/v1/products?search=${query}`);
            const response = await axios.get(`${BASE_URL}/api/v1/products?search=${query}`);
            console.log("API Yanıtı:", response.data);

            // Buradaki kontrol ve atama satırını değiştiriyoruz
            // response.data.data direkt olarak ürün dizisini içeriyorsa:
            if (response.data.status === 'success' && Array.isArray(response.data.data)) {
                setSearchResults(response.data.data); // data.results yerine doğrudan data'yı atıyoruz
                console.log("Arama sonuçları başarıyla çekildi:", response.data.data.length, "ürün bulundu.");
            } else {
                setSearchResults([]);
                // Hata mesajını daha açıklayıcı hale getirebiliriz
                console.log("Arama sonuçları boş veya beklenen format (response.data.data bir dizi değil) uygun değil.");
            }
        } catch (error) {
            console.error("Arama sonuçları çekilirken hata oluştu:", error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            fetchSearchResults(term);
        }, 300);
    };

    const handleSearchButtonClick = () => {
        fetchSearchResults(searchTerm);
    };

    const handleProductClick = (productSlug: string) => {
        navigate(`/product/${productSlug}`);
        setIsSearchActive(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <>
            <Mobilenavbar openMainDrawer={openMainDrawer} />
            <div className="hdr-5">
                <div className="flex mx-auto">
                    <Link to="/">
                        <img className="logo-5" src="/images/logo.png" alt="Logo" />
                    </Link>

                    <div className="navbar-search-wrapper">
                        <input
                            className="first-input"
                            type="text"
                            placeholder="Ürün Ara..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => (searchTerm.length > 0 || searchLoading || searchResults.length > 0) && setIsSearchActive(true)}
                        />
                        <button className="btn-5" onClick={handleSearchButtonClick}>ARA</button>

                        {isSearchActive && (searchTerm.length > 0 || searchLoading) && (
                            <div className="search-results-dropdown" ref={searchResultsRef}>
                                {searchLoading ? (
                                    <p className="search-status-message">Ürünler aranıyor...</p>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((product) => (
                                        <div key={product.id} className="search-result-item" onClick={() => handleProductClick(product.slug)}>
                                            <img src={`${BASE_URL}${product.photo_src}`} alt={product.name} className="search-result-image" />
                                            <div className="search-result-info">
                                                <p className="search-result-name">{product.name}</p>
                                                <p className="search-result-price">{product.price_info.total_price} TL</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    searchTerm.length >= 2 && !searchLoading && <p className="search-status-message">Aradığınız ürün bulunamadı.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <Dropdown />

                    <Drawer
                        position="right"
                        size="sm"
                        opened={openedMainDrawer}
                        onClose={handleCloseDrawer}
                        withCloseButton={false}
                    >
                        <div className="drawer-content">
                            <p className="mybag">SEPETİM</p>
                            <div className="aaa">
                                {!cartLoaded ? (
                                    <p className="empty-cart">Sepetiniz Yükleniyor...</p>
                                ) : bears.length === 0 ? (
                                    <p className="empty-cart">Sepetinizde Ürün Bulunmamaktadır</p>
                                ) : (
                                    [...bears].reverse().map((bear) => (
                                        <div key={bear.id} className="cart-item">
                                            <div className="item-image">
                                                <img src={bear.image} alt={bear.name} />
                                            </div>
                                            <div className="item-details">
                                                <p className="item-name">{bear.name}</p>
                                                {bear.aroma && <p className="item-aroma">{bear.aroma}</p>}
                                                {bear.size?.pieces && <p className="item-size">{bear.size.pieces} KG</p>}
                                            </div>
                                            <div className="cart-item-actions">
                                                <p className="cart-item-price">{bear.total_price || bear.price} TL</p>
                                                <div className="quantity-controls">
                                                    <button className="delete-icon-button" onClick={() => handleRemoveFromCart(bear)}>
                                                        <RiDeleteBin6Line className="delete-icon" />
                                                    </button>
                                                    <div className="ar">{bear.count}</div>
                                                    <button className="ar" onClick={() => handleIncreaseQuantity(bear)}>
                                                        <AiOutlinePlus />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cartLoaded && bears.length > 0 && (
                                <>
                                    <p className="total-price">Toplam Tutar: {calculateTotalPrice} TL</p>
                                    <div className="btn-container">
                                        <button onClick={handleCheckout} className="btn-77">
                                            DEVAM ET <img src="images/3.png" alt="" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </Drawer>

                    <button onClick={openMainDrawer} className="btn-6">
                        <div className="roundedd">{totalItemCount}</div>
                        <MdOutlineShoppingCart className="icn-7" />
                        SEPET
                    </button>
                </div>
            </div>
        </>
    );
}