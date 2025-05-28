

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../../store/sepet';
import Accordionn from './accordion';
import './productsdetail.css';
import { Button } from '../../components/variant/Button';
import RecentlyViewedProducts from '../../components/RecentlyViewedProducts';
import YorumGrafik from './yorumgrafik';


import { useSnackbar } from 'notistack';


interface NutritionalContent {
    nutrition_facts: {
        portion_sizes: string;
        ingredients: { name: string; amounts: string }[];
    };
    ingredients: { aroma: string; value: string }[];
    amino_acid_facts?: {
        portion_sizes: string;
        ingredients: { name: string; amounts: string }[];
    };
}

interface Product {
    id: number;
    name: string;
    short_explanation: string;
    average_star: number;
    comment_count: number;
    tags: string[];
    variants: Variant[];
    explanation: {
        description: string;
        features: string;
        nutritional_content: NutritionalContent;
        usage: string;
        slug: string;
    };
    slug: string;
}

interface Variant {
    id: number;
    photo_src: string;
    aroma: string;
    size: {
        gram?: number;
        pieces: number;
        total_services: number;
    };
    price: {
        total_price: number;
        discounted_price: number | null;
        price_per_servings: number;
    };
}

interface CartItem {
    id: string;
    name: string;
    aroma: string;
    size: { gram?: number; pieces: number; total_services: number };
    price: number;
    count: number;
    image?: string;
    product_variant_id: string;
    product_id: string;
}

interface AromaColors {
    [key: string]: string;
}

const ProductDetail: React.FC = () => {
    useEffect(() => {
        console.log("ProductDetail component yüklendi");
    }, []);

    const { productId, slug } = useParams<{ productId: string; slug: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [selectedAroma, setSelectedAroma] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<{ pieces: number; total_services: number } | null>(null);
    const isLoggedIn = useCartStore((state) => state.isLoggedIn);
    const [addingToCart, setAddingToCart] = useState(false);
    const [pieces, setPieces] = useState(1);
    const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
    const [viewedSlugs, setViewedSlugs] = useState<string[]>([]);
    const addItemToCart = useCartStore((state) => state.addItemToCart);

  
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const storedSlugs = JSON.parse(localStorage.getItem('viewedSlugs') || '[]');
        setViewedSlugs(storedSlugs);
    }, []);

    useEffect(() => {
        if (slug) {
            setLoading(true);
            axios
                .get(`https://fe1111.projects.academy.onlyjs.com/api/v1/products/${slug}`)
                .then((response) => {
                    if (response.data.status === 'success') {
                        const productData = response.data.data;
                        setProduct(productData);

                        let updatedSlugs = [...viewedSlugs];
                        if (!updatedSlugs.includes(slug)) {
                            updatedSlugs.push(slug);
                            localStorage.setItem('viewedSlugs', JSON.stringify(updatedSlugs));
                            setViewedSlugs(updatedSlugs);
                        }

                        if (productData.variants.length > 0) {
                            setSelectedAroma(productData.variants[0].aroma);
                            setSelectedSize({ pieces: productData.variants[0].size.pieces, total_services: productData.variants[0].size.total_services });
                            setSelectedVariant(productData.variants[0]);
                        }
                    } else {
                        setError('Ürün verisi alınamadı');
                    }
                })
                .catch((error) => {
                    setError('Ürün yüklenirken hata oluştu');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [slug, viewedSlugs]);

    useEffect(() => {
        if (product && product.variants.length > 0) {
            setSelectedAroma(product.variants[0].aroma);
            setSelectedSize({ pieces: product.variants[0].size.pieces, total_services: product.variants[0].size.total_services });
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    useEffect(() => {
        if (product && selectedAroma && selectedSize) {
            const variant = product.variants.find(
                (v) => v.aroma === selectedAroma && v.size.pieces === selectedSize.pieces && v.size.total_services === selectedSize.total_services
            );
            setSelectedVariant(variant || null);
        }
    }, [selectedAroma, selectedSize, product]);

    const addToCart = useCallback(async () => {
        if (!isLoggedIn) {
            alert('Sepete ürün eklemek için lütfen giriş yapın.');
            navigate('/login');
            return;
        }

        if (!selectedVariant || !product) {
            alert('Lütfen bir varyant seçin.');
            return;
        }

        setAddingToCart(true);
        setError(null);

        const cartItem: CartItem = {
            id: String(selectedVariant.id),
            product_id: String(product.id),
            product_variant_id: String(selectedVariant.id),
            name: product.name,
            aroma: selectedVariant.aroma,
            size: selectedVariant.size,
            price: selectedVariant.price.total_price,
            count: pieces,
            image: `https://fe1111.projects.academy.onlyjs.com${selectedVariant.photo_src.startsWith('/') ? selectedVariant.photo_src : '/' + selectedVariant.photo_src}`,
        };

        try {
            await addItemToCart(cartItem);
           
            enqueueSnackbar('Ürün sepetinize eklendi!', { variant: 'success' });
        } catch (err: any) {
            setError('Sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
            console.error('Sepete eklerken hata:', err);
          
            enqueueSnackbar('Sepete eklenirken bir hata oluştu!', { variant: 'error' });
        } finally {
            setAddingToCart(false);
        }
    }, [isLoggedIn, navigate, selectedVariant, product, pieces, addItemToCart, enqueueSnackbar]); 

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 

    const getBackgroundColor = (aroma: string) => {
        const Aromas: AromaColors = {
            'Bisküvi': 'rgba(230, 188, 121, 1)',
            'Çikolata': 'rgba(86, 50, 29, 1)',
            'Muz': 'rgba(241, 208, 24, 1)',
            'Salted Caramel': 'rgba(182, 67, 0, 1)',
            'Choco Nut': 'rgba(123, 63, 0, 1)',
            'Hindistan Cevizi': 'rgba(186, 144, 81, 1)',
            'Raspberry Cheesecake': 'rgba(204, 30, 95, 1)',
            'Çilek': 'rgba(214, 31, 51, 1)',
            'Karpuz': 'rgba(188, 40, 40, 1)',
            'Limonata': 'rgba(227, 206, 141, 1)',
            'Fruit Fusion':
                'linear-gradient(25deg,hsl(39deg 100% 50%) 0%,hsl(34deg 100% 50%) 6%,hsl(29deg 100% 50%) 11%,hsl(24deg 100% 50%) 17%,hsl(19deg 100% 50%) 22%,hsl(20deg 100% 50%) 28%,hsl(28deg 100% 50%) 33%,hsl(35deg 100% 50%) 39%,hsl(43deg 100% 50%) 44%,hsl(51deg 100% 50%) 50%,hsl(33deg 100% 55%) 56%,hsl(15deg 100% 59%) 61%,hsl(357deg 100% 64%) 67%,hsl(339deg 100% 68%) 72%,hsl(327deg 100% 65%) 78%,hsl(320deg 100% 55%) 83%,hsl(313deg 100% 45%) 89%,hsl(307deg 100% 35%) 94%,hsl(300deg 100% 25%) 100%)',
            'Berry Blast': 'linear-gradient(to top, #a92f3e, #9d2555, #872769, #673078, #3a377e)',
            'Ahududu': 'rgba(181, 123, 118, 1)',
            'Yeşil Elma': 'rgba(151, 211, 14, 1)',
            'Şeftali': 'rgba(109, 36, 29, 1)',
            'Tigers Blood': 'rgba(172, 33, 34, 1)',
        };
        return Aromas[aroma] || 'rgba(78, 78, 78, 1)';
    };

  
    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            if (viewedSlugs.length > 0) {
                try {
                    const fetchedProducts: Product[] = [];
                  
                    const uniqueSlugs = [...new Set(viewedSlugs)];

                    for (const viewedSlug of uniqueSlugs) {
                        const response = await axios.get(`https://fe1111.projects.academy.onlyjs.com/api/v1/products/${viewedSlug}`);
                        if (response.data.status === 'success') {
                            fetchedProducts.push(response.data.data);
                        } else {
                            console.warn(`Ürün bulunamadı: ${viewedSlug}`);
                        }
                    }
                    setRecentlyViewedProducts(fetchedProducts);
                } catch (error) {
                    console.error("Görüntülenen ürünler alınırken hata oluştu", error);
                    setError('Görüntülenen ürünler yüklenirken hata oluştu.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        if (!loading) { 
            fetchRecentlyViewed();
        }
    }, [viewedSlugs, loading]);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>Hata: {error}</p>;
    if (!product) return <p>Ürün bulunamadı.</p>;

    const productAromas = [...new Set(product.variants.map((v) => v.aroma))];
    const productSizes = product.variants.reduce((acc: { pieces: number; total_services: number }[], variant) => {
        const existingSize = acc.find((size) => size.pieces === variant.size.pieces);
        if (!existingSize) {
            acc.push({ pieces: variant.size.pieces, total_services: variant.size.total_services });
        }
        return acc;
    }, []);

    const renderStars = (averageStar: number) => {
        const filledStars = Math.round(averageStar);
        const emptyStars = 5 - filledStars;

        const stars = [];
        for (let i = 0; i < filledStars; i++) {
            stars.push(
                <span key={`filled-${i}`} style={{ color: 'gold' }}>
                    ★
                </span>
            );
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <span key={`empty-${i}`} style={{ color: 'lightgray' }}>
                    ☆
                </span>
            );
        }
        return stars;
    };

    return (
        <div>
            <div className="container mx-auto cc">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {selectedVariant && (
                            <img
                                className="ürün-img"
                                src={`https://fe1111.projects.academy.onlyjs.com${selectedVariant.photo_src.startsWith('/') ? selectedVariant.photo_src : '/' + selectedVariant.photo_src}`}
                                alt={product.name}
                            />
                        )}
                    </div>
                    <div>
                        <h1 className="why-1">{product.name}</h1>
                        <p className="best-1">{product.short_explanation}</p>
                        <div className="flex items-center">
                            {renderStars(product.average_star)}
                            <span className="ml-2">{product.comment_count} Yorum</span>
                        </div>

                        <div className="tags-container flex">
                            {product.tags.map((tag, index) => (
                                <button key={index} className="all-btn-2">
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <div className="sper-1"></div>

                        <h2 className="arm-1">AROMA:</h2>
                        <div className="aromas-container">
                            {productAromas.map((aroma, index) => (
                                <Button
                                    key={index}
                                    className={`flv-1 ${selectedAroma === aroma ? 'selected' : ''}`}
                                    onClick={() => setSelectedAroma(aroma)}
                                >
                                    <div className="flavor-item">
                                        {aroma}
                                        <div className="color-box" style={{ backgroundColor: getBackgroundColor(aroma) }} />
                                    </div>
                                </Button>
                            ))}
                        </div>

                        <h2 className="arm-1">BOYUT:</h2>
                        <div className="sizes-container flex gap-4">
                            {productSizes.map((size, index) => {
                                const currentVariant = product.variants.find(
                                    (v) =>
                                        v.aroma === selectedAroma &&
                                        v.size.pieces === size.pieces &&
                                        v.size.total_services === size.total_services
                                );

                                let discountPercentage = 0;
                                if (
                                    currentVariant &&
                                    currentVariant.price.discounted_price !== null &&
                                    currentVariant.price.total_price > 0
                                ) {
                                    discountPercentage = Math.round(
                                        ((currentVariant.price.total_price - currentVariant.price.discounted_price) /
                                            currentVariant.price.total_price) *
                                            100
                                    );
                                }

                                return (
                                    <Button
                                        key={index}
                                        className={`kg-box ${
                                            selectedSize?.pieces === size.pieces &&
                                            selectedSize?.total_services === size.total_services
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        <div className="kg-text">{size.pieces} KG</div>
                                        <div className="kg-text srv">{size.total_services} servis</div>
                                        {discountPercentage > 0 && (
                                            <div className="discount-badge">
                                                %{discountPercentage} İndirim
                                            </div>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                        {selectedVariant && (
                            <div className="selected-variant grid grid-cols-2 gap-4 res-tex">
                                <div className="flex items-center">
                                    {selectedVariant.price.discounted_price !== null ? (
                                        <>
                                            <p className="discounted-price mr-2">
                                                {selectedVariant.price.discounted_price} TL
                                            </p>
                                            <p className="original-price">
                                                {selectedVariant.price.total_price} TL
                                            </p>
                                        </>
                                    ) : (
                                        <p className="price-1">{selectedVariant.price.total_price} TL</p>
                                    )}
                                </div>
                                <div>
                                    <p className="servs">
                                        {selectedVariant.price.price_per_servings} TL/servis
                                    </p>
                                </div>
                            </div>)}
                        <div className="adet-secim flex items-center gap-4 mt-4">

                            <div className="adet-kontrol flex items-center">
                                <button
                                    className="in-2"
                                    onClick={() => setPieces(Math.max(1, pieces - 1))}
                                    disabled={pieces <= 1}
                                >
                                    -
                                </button>
                                <div className="count">
                                    {pieces}
                                </div>
                                <button
                                    className="in-2"
                                    onClick={() => setPieces(pieces + 1)}
                                >
                                    +
                                </button>
                                <button className='ekle-btn ml-4' disabled={addingToCart} onClick={addToCart}>
                                    {addingToCart ? "Ekleniyor..." : "Sepete Ekle"}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 fd-1">
                            <div className="flex">
                                <img className="img-two" src="/images/car.png" alt="Ücretsiz Kargo" />
                                <p className="free-1">
                                    <span>Aynı Gün</span>
                                    <span>Ücretsiz Kargo</span>
                                </p>
                            </div>
                            <div className="flex">
                                <img className="img-two" src="/images/t.png" alt="Kolay İade" />
                                <p className="free-1">
                                    <span>750.000+</span>
                                    <span>Mutlu Müşteri</span>
                                </p>
                            </div>
                            <div className="flex">
                                <img className="img-two" src="/images/100.png" alt="Güvenli Alışveriş" />
                                <p className="free-1">
                                    <span>Memnuniyet</span>
                                    <span>Garantisi</span>
                                </p>
                            </div>
                        </div>
                        <div className="sper-1"></div>
                        <Accordionn product={product} />
                    </div>
                </div>
            </div>
            <h1 className="ass">SON GÖRÜNTÜLENEN ÜRÜNLER</h1>
            <RecentlyViewedProducts viewedProducts={recentlyViewedProducts} />
            {product && <YorumGrafik slug={product.slug} />}
        </div>
    );
};

export default ProductDetail;