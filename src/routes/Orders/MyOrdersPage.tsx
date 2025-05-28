import React, { useState, useEffect } from 'react';
import { GetMyAllOrder, GetMyOrderDetails } from '../signup/auth';
import { NavLink } from 'react-router-dom';
import '../../routes/Profile/Profile.css';
import './MyOrdersPage.css';

interface Size {
    gram: number;
    pieces: number;
    total_services: number;
}

interface CartDetail {
    variant_id: string;
    name: string;
    photo_src: string;
    pieces: string;
    unit_price: string;
    total_price: string;
    slug: string;
}

interface AllOrderTypes {
    status: string;
    data: {
        order_no: string;
        order_status: string;
        created_at: string;
        total_price: number;
        cart_detail: CartDetail[];
    }[];
}

interface OrderDetailsType {
    status: string;
    data: {
        order_no: string;
        order_status: string;
        shipment_tracking_number: string;
        address: {
            title: string;
            country: string;
            region: string;
            subregion: string;
            full_address: string;
            phone_number: string;
        };
        payment_detail: {
            card_digits: string;
            card_expiration_date: string;
            card_security_code: string;
            payment_type: string;
            card_type: string;
            base_price: number;
            shipment_fee: number;
            payment_fee: number;
            discount_ratio: number;
            discount_amount: number;
            final_price: number;
        };
        shopping_cart: {
            total_price: number;
            items: {
                product_id: string;
                product_slug: string;
                product_variant_id: string;
                product: string;
                product_variant_detail: {
                    size: Size;
                    aroma: string;
                    photo_src: string;
                };
                pieces: number;
                unit_price: number;
                total_price: number;
            }[];
        };
    };
}


const translateOrderStatus = (status: string): string => {
    switch (status) {
        case 'delivered':
        case 'Delivered':
            return ' Sipariş Teslim Edildi';
        case 'in_cargo':
        case 'Shipped': 
            return ' Sipariş Kargoda';
        case 'getting_ready':
        case 'Processing': 
            return ' Sipariş Hazırlanıyor';
        default:
            return ''; 
    }
};

const getImageUrl = (src: string) => {
    if (!src) return '';
    return src.startsWith('/') ? `https://fe1111.projects.academy.onlyjs.com${src}` : `https://fe1111.projects.academy.onlyjs.com/${src}`;
};


const MyOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<AllOrderTypes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderDetailsType | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GetMyAllOrder();
                setOrders(response);
            } catch (error: any) {
                setError('Siparişler yüklenirken bir hata oluştu.');
                console.error('Siparişler yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleViewDetails = async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const details = await GetMyOrderDetails(orderId);
            setSelectedOrderDetails(details);
            setShowDetailsModal(true);
            setExpandedOrderId(orderId);
        } catch (error: any) {
            setError(`Sipariş detayları yüklenirken bir hata oluştu: ${orderId}`);
            console.error(`Sipariş detayları yüklenirken hata (${orderId}):`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedOrderDetails(null);
        setExpandedOrderId(null);
    };

    const toggleOrderDetails = (orderId: string) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
            handleViewDetails(orderId);
        }
    };

    if (loading) {
        return <p>Siparişler yükleniyor...</p>;
    }

    if (error) {
        return <p>Hata: {error}</p>;
    }

    if (!orders || orders.data.length === 0) {
        return <p>Henüz hiç siparişiniz bulunmuyor.</p>;
    }

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-[2fr_10fr]">
                {/* Sol Menü */}
                <div className="profile-header-container">
                    <div className="profile-links-container">
                        <NavLink to="/profile" className="profile-title-link profile-link-item">
                            <img
                                src="/images/13.png"
                                alt="Hesabım İkonu"
                                className="profile-title-icon"
                            />
                            <p className="profile-section-title">Hesabım</p>
                        </NavLink>
                        <NavLink to="/orders" className="profile-title-link profile-link-item">
                            <img
                                src="/images/14.png"
                                alt="Siparişlerim İkonu"
                                className="profile-title-icon"
                            />
                            <p className="profile-section-title">Siparişlerim</p>
                        </NavLink>
                        <NavLink to="/add-address" className="profile-title-link profile-link-item">
                            <img
                                src="/images/15.png"
                                alt="Adreslerim İkonu"
                                className="profile-title-icon"
                            />
                            <p className="profile-section-title">Adreslerim</p>
                        </NavLink>
                    </div>
                </div>
x
                <div className="order-list-container">
                    <h1 className='a2'>Siparişlerim ({orders ? orders.data.length : 0})</h1>
                    <ul className="order-list">
                        {orders.data.map((order) => (
                            <li key={order.order_no} className="order-item">
                                <div className="order-header">
                                    {order.cart_detail.length > 0 && order.cart_detail[0].photo_src && (
                                        <div className="order-image-container">
                                            <img
                                                src={getImageUrl(order.cart_detail[0].photo_src)}
                                                alt={order.cart_detail[0].name}
                                                className="order-image"
                                            />
                                        </div>
                                    )}
                                    <div className="order-header-details">
                                     
                                        <div className={`order-status ${translateOrderStatus(order.order_status) === 'Teslim Edildi' ? 'delivered' : ''}`}>
                                            <p className='sssss'>{translateOrderStatus(order.order_status)}</p>
                                        </div>
                                        {order.cart_detail.length > 0 && (
                                            <div >
                                                <strong className="product-name">{order.cart_detail[0].name}</strong>
                                            </div>
                                        )}
                                        <div >
                                            <strong className="order-date" > {new Date(order.created_at).toLocaleDateString()} Tarihinde Sipariş Verildi</strong>
                                        </div>
                                        <div >
                                            <strong className="order-number">{order.order_no} numaralı sipariş </strong>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleOrderDetails(order.order_no)}
                                        className="view-details-button"
                                    >
                                        Detayları Gör
                                    </button>
                                </div>
                                {expandedOrderId === order.order_no && (
                                    <div className="order-details">
                                        <div className="order-total">
                                            <strong>Toplam Tutar:</strong> {order.total_price} TL
                                        </div>
                                        <div className="order-products">
                                            <strong>Ürünler:</strong>
                                            <ul className="product-list">
                                                {order.cart_detail.map((item: CartDetail) => (
                                                    <li key={item.variant_id} className="product-item">
                                                        <div className="product-image-container">
                                                            <img
                                                                src={getImageUrl(item.photo_src)}
                                                                alt={item.name}
                                                                className="product-image"
                                                            />
                                                        </div>
                                                        <div className="product-details">
                                                            <div className="product-name"> {item.name}</div>
                                                            <div><strong>Adet:</strong> {item.pieces}</div>
                                                            
                                                            <div><strong>Toplam Fiyat:</strong> {item.total_price} TL</div>
                                                            <NavLink to={`/product/${item.slug}`} className="product-link">
                                                                Ürünü Gör
                                                            </NavLink>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {showDetailsModal && selectedOrderDetails && (
                <div className="modal">
                    <h2 className="modal-title">Sipariş Detayları ({selectedOrderDetails.data.order_no})</h2>
                    <div className="order-info">
                        
                        <p><strong>Sipariş Durumu:</strong> <span>{translateOrderStatus(selectedOrderDetails.data.order_status)}</span></p>
                        <p><strong>Kargo Takip No:</strong> <span>{selectedOrderDetails.data.shipment_tracking_number}</span></p>
                    </div>

                    <div className="address-info">
                        <h3 className="section-title">Adres Bilgileri:</h3>
                        <p><strong>Adres:</strong> <span>{selectedOrderDetails.data.address.full_address}, {selectedOrderDetails.data.address.subregion}, {selectedOrderDetails.data.address.region}, {selectedOrderDetails.data.address.country}</span></p>
                        <p><strong>Telefon:</strong> <span>{selectedOrderDetails.data.address.phone_number}</span></p>
                    </div>

                    <div className="payment-info">
                        <h3 className="section-title">Ödeme Detayları:</h3>
                        <p><strong>Ödeme Türü:</strong> <span>{selectedOrderDetails.data.payment_detail.payment_type} - {selectedOrderDetails.data.payment_detail.card_type}</span></p>
                    </div>

                    <div className="order-items">
                        <h3 className="section-title">Siparişler</h3>
                        <ul className="product-list">
                            {selectedOrderDetails.data.shopping_cart.items.map((item: any) => (
                                <li key={item.product_id} className="product-item">
                                    <div><strong>Ürün:</strong> <span>{item.product} ({item.product_variant_detail.aroma} - {item.product_variant_detail.size.pieces} {item.product_variant_detail.size.gram} gr)</span></div>
                                    <div><strong>Adet:</strong> <span>{item.pieces}</span></div>
                                    
                                    <div><strong>Toplam Fiyat:</strong> <span>{item.total_price} TL</span></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={handleCloseDetailsModal} className="close-button">Kapat</button>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;