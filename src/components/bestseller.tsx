import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../routes/Products/productCard';
import './bestseller.css';

const BASE_URL = 'https://fe1111.projects.academy.onlyjs.com';

const Bestseller: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/products/best-sellers`);

                if (Array.isArray(response.data.data)) {
                    setProducts(response.data.data);
                } else {
                    setError('Beklenen formatta veri alınamadı');
                }
            } catch (error: any) {
                setError(error.message || 'Veri alınırken hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='bestseller container mx-auto'>
            <h3 className='bsk'>ÇOK SATANLAR</h3>
            <div className='card-container'>
                <div className="grid lg:grid-cols-6 gap-4 sm:grid-cols-3 md:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard
                            key={product.slug || product.id} // Benzersiz key
                            product={product}
                            baseURL={BASE_URL}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bestseller;
