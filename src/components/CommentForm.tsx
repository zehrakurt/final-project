import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCartStore } from '../store/sepet'; // isLoggedIn bilgisini almak için
import { GetMyAllOrder,postProductComment } from '../routes/signup/auth'; // Kullanıcının siparişlerini çekmek için
import './CommentForm.css'; // Stil dosyası için

interface CommentFormProps {
    productSlug: string;
    onCommentSubmitted: () => void; // Yorum başarıyla gönderildiğinde çağrılacak callback
}

const CommentForm: React.FC<CommentFormProps> = ({ productSlug, onCommentSubmitted }) => {
    const [stars, setStars] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [hasPurchased, setHasPurchased] = useState(false); // Ürünü satın alıp almadığını tutar
    const isLoggedIn = useCartStore((state) => state.isLoggedIn);

    useEffect(() => {
        const checkPurchaseStatus = async () => {
            if (!isLoggedIn) {
                setHasPurchased(false);
                return;
            }

            try {
                const response = await GetMyAllOrder();
                if (response.status === 'success' && response.data.length > 0) {
                    const purchased = response.data.some(order =>
                        order.cart_detail.some(item => item.slug === productSlug)
                    );
                    setHasPurchased(purchased);
                } else {
                    setHasPurchased(false);
                }
            } catch (err) {
                console.error("Sipariş geçmişi kontrol edilirken hata:", err);
                setError("Sipariş geçmişiniz kontrol edilirken bir sorun oluştu.");
                setHasPurchased(false); // Hata durumunda yorum yapmayı engelle
            }
        };

        checkPurchaseStatus();
    }, [isLoggedIn, productSlug]);

   // src/components/CommentForm/CommentForm.tsx içinde

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (!isLoggedIn) {
        setError('Yorum yapabilmek için lütfen giriş yapın.');
        setSubmitting(false);
        return;
    }

    if (!hasPurchased) {
        setError('Bu ürüne yorum yapabilmek için ürünü satın almış olmanız gerekmektedir.');
        setSubmitting(false);
        return;
    }

    if (stars === 0 || !title.trim() || !comment.trim()) {
        setError('Lütfen tüm alanları doldurun ve en az bir yıldız seçin.');
        setSubmitting(false);
        return;
    }

    try {
        // Token'ı manuel olarak localStorage'dan alıp axios'a vermek yerine,
        // merkezi API fonksiyonumuzu kullanıyoruz:
        const response = await postProductComment(productSlug, {
            stars,
            title,
            comment,
        });

        if (response.status === 'success') {
            setSuccess('Yorumunuz başarıyla gönderildi!');
            setStars(0);
            setTitle('');
            setComment('');
            onCommentSubmitted(); // Parent bileşeni bilgilendir
        } else {
            // Backend'den gelen hata mesajını doğrudan kullanabiliriz
            setError(response.message || 'Yorum gönderilirken bir hata oluştu.');
        }
    } catch (err: any) {
        // Hata yakalama FetchWithAuth'tan geldiği için err.response olmayabilir.
        // Doğrudan err.message'ı kullanmak daha güvenli.
        setError(err.message || 'Yorum gönderilirken beklenmedik bir hata oluştu.');
        console.error('Yorum gönderme hatası:', err);
    } finally {
        setSubmitting(false);
    }
};

    return (
        <div className="comment-form-container">
            <h3>Ürün Yorumu Yap</h3>
            {!isLoggedIn ? (
                <p className="comment-info-message">Yorum yapabilmek için lütfen <a href="/login">giriş yapın</a>.</p>
            ) : !hasPurchased ? (
                <p className="comment-info-message">Bu ürüne yorum yapabilmek için ürünü satın almış olmanız gerekmektedir.</p>
            ) : (
                <form onSubmit={handleSubmit} className="comment-form">
                    <div className="form-group">
                        <label htmlFor="stars">Yıldız Puanı:</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= stars ? 'filled' : ''}`}
                                    onClick={() => setStars(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Yorum Başlığı:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Örn: Çok iyiydi, Harika ürün!"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Yorumunuz:</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            placeholder="Ürün hakkındaki düşüncelerinizi yazın..."
                            required
                        ></textarea>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default CommentForm;