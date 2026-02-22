import React from 'react';
import './productcard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

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

interface ProductCardProps {
    product: Product;
    baseURL: string;
    isProductListPage?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, baseURL, isProductListPage }) => {




    const stars = Array.from({ length: 5 }, (_, index) => ({
        id: `${product.slug}-star-${index}`,
        filled: index < Math.round(product.average_star || 0),
    }));

    const discountPercentage =
        product.price_info &&
            product.price_info.discounted_price &&
            product.price_info.total_price
            ? Math.round(
                ((product.price_info.total_price - product.price_info.discounted_price) /
                    product.price_info.total_price) *
                100
            )
            : null;

    const discountBoxClass = isProductListPage ? "discount-box discount-box-product-list" : "discount-box";

    return (
        <Link to={`/product/${product.slug}`} className="card max-w-xs mx-auto relative">
            <img className="img-1" src={`${baseURL}${product.photo_src}`} alt={product.name} />

            {discountPercentage !== null && (
                <div className={discountBoxClass}>
                    %{discountPercentage} <span className="discount-text">İNDİRİM</span>
                </div>
            )}

            <h2 className="name-1">{product.name}</h2>
            <p className="explan">{product.short_explanation}</p>

            <div className="stars-container">
                {stars.map((star) => (
                    <FontAwesomeIcon
                        key={star.id}
                        icon={faStar}
                        className={`star ${star.filled ? 'text-yellow-500' : 'text-gray-300'}`}
                    />
                ))}
            </div>

            <p className="comment">{product.comment_count} Yorum</p>

            <div className="price-container">
                {product.price_info && product.price_info.discounted_price ? (
                    <>
                        <p className="discounted-price">
                            {product.price_info.discounted_price}₺
                        </p>
                        <p className="original-price">
                            {product.price_info.total_price}₺
                        </p>
                    </>
                ) : (
                    <p className="price">
                        {product.price_info && product.price_info.total_price
                            ? product.price_info.total_price + '₺'
                            : 'Fiyat Yok'}
                    </p>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;