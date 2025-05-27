import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../routes/Products/productCard';
import './bestseller.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const BASE_URL = 'https://fe1111.projects.academy.onlyjs.com';

const RecentlyViewedProducts: React.FC = () => {
    const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const viewedSlugs = JSON.parse(localStorage.getItem('viewedSlugs') || '[]');
        if (viewedSlugs.length > 0) {
            const fetchProducts = async () => {
                try {
                    const products = await Promise.all(
                        viewedSlugs.map(async (slug: string) => {
                            const response = await axios.get(`${BASE_URL}/api/v1/products/${slug}`);
                            return response.data.data;
                        })
                    );

                    const validatedProducts = products
                        .filter(product => product !== null)
                        .map(product => ({
                            ...product,
                            photo_src: product?.variants?.[0]?.photo_src || '/varsayilan-resim.jpg',
                            price_info: product?.variants?.[0]?.price || { total_price: null }
                        }));

                    setRecentlyViewed(validatedProducts);
                    setLoading(false);
                } catch (err) {
                    setError('Ürünler yüklenirken bir hata oluştu.');
                    setLoading(false);
                }
            };
            fetchProducts();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>Hata: {error}</p>;

    return (
        <div className='bestseller container mx-auto relative'>
            

            <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1}
                navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next'
                }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 6 }
                }}
            >
                {recentlyViewed.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} baseURL={BASE_URL} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default RecentlyViewedProducts;
