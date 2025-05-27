import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ProductCard from './productCard';
import './productList.css';

const BASE_URL = 'https://fe1111.projects.academy.onlyjs.com';

interface PriceInfo {
    discounted_price: number;
    total_price: number;
}

interface Product {
    id: number;
    name: string;
    photo_src: string;
    price_info: PriceInfo;
    slug: string;
    short_explanation: string;
    average_star: number;
    comment_count: number;
}

const ProductList: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [moreProducts, setMoreProducts] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let url = `${BASE_URL}/api/v1/products?limit=12&offset=${offset * 12}`;
            if (slug && slug !== 'all-products') {
                url += `&category=${slug}`;
            }

            const response = await axios.get(url);
            const results = response.data.data.results;

            if (response.data.status === 'success' && Array.isArray(results)) {
                setProducts(offset === 0 ? results : (prev) => [...prev, ...results]);
                setMoreProducts(results.length === 12);
                setTotalCount(response.data.data.count);
            } else {
                setError('Ürünler alınırken bir hata oluştu.');
            }
        } catch (err: any) {
            setError('Sunucuya bağlanırken hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [slug, offset]);

    useEffect(() => {
        setOffset(0);
        setProducts([]);
        setLoading(true);
    }, [slug]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleShowMore = () => {
        setOffset((prev) => prev + 1);
    };

    if (loading && offset === 0) return <p>Yükleniyor...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="protein container mx-auto text-center">
            <h3 className="for-h3">{slug?.toUpperCase() || 'TÜM ÜRÜNLER'}</h3>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 justify-center">
                {products.map((product) => (
                    <div key={product.id} className="product-item justify-center">
                        <Link to={`/product/${product.slug}`} className="product-link">
                            <ProductCard product={product} baseURL={BASE_URL} isProductListPage={true} />
                        </Link>
                    </div>
                ))}
            </div>
            <p className="ser-7 mt-4">Toplam {totalCount} ürün bulundu</p>
            {moreProducts && (
                <button onClick={handleShowMore} className="text-blue mt-4">
                    Daha Fazla Göster
                </button>
            )}
        </div>
    );
};

export default ProductList;