

import React, { useEffect, useState } from 'react';
import { getProductComments } from './api';
import './yorumgrafik.css';
import RatingStars from './RatingStars';
import Bestseller from '../../components/bestseller';
import CommentForm from '../../components/CommentForm'; 

interface Comment {
  stars: string;
  comment: string;
  title: string;
  created_at: string;
  aroma: string;
  first_name: string;
  last_name: string;
}

interface CommentData {
  status: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Comment[];
  };
}

interface YorumGrafikProps {
  slug: string;
}

const YorumGrafik: React.FC<YorumGrafikProps> = ({ slug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showCommentForm, setShowCommentForm] = useState(false); 
  const fetchComments = async () => {
    if (!slug) {
      setError('Ürün slug bilgisi eksik.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await getProductComments(slug, offset);
      if (response && response.data && response.data.results) {
        setComments(response.data.results);
        setCommentCount(response.data.count);
      } else {
        setError('Beklenmeyen veri formatı.');
        console.error('Beklenmeyen veri formatı:', response);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('Bu ürün için yorum bulunamadı.');
      } else {
        setError('Yorumlar yüklenirken hata oluştu.');
        console.error('Yorum yükleme hatası:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [slug, offset]);

 
  const handleCommentSubmitted = () => {
    setShowCommentForm(false); 
    setOffset(0); 
    setCurrentPage(1); 
    fetchComments();
  };

  const handleNextPage = () => {
    setOffset(offset + limit);
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (offset > 0) {
      setOffset(offset - limit);
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p>Yorumlar yükleniyor...</p>;
  if (error && comments.length === 0) return <p>Hata: {error}</p>;

  return (
    <div className="container mx-auto px-4 sm:px-6">
     
      <div className="yorumlar" onClick={() => setShowCommentForm(!showCommentForm)}>
        
        <span className="yorum-text">
          YORUM YAP ({commentCount})
        </span>
       
        {showCommentForm && <span className="close-form-indicator"></span>}
      </div>

  
      {showCommentForm && (
        <div className="comment-form-section"> 
          <CommentForm productSlug={slug} onCommentSubmitted={handleCommentSubmitted} />
        </div>
      )}

      {comments.length > 0 ? (
        <div>
          {comments.map((comment, index) => (
            <div key={index} className="yorum-listesi">
              <div className="yorum-item">
                <div className="yorum-satir">
                  <div className="yorum-yildiz-kullanici">
                    <span className="yorum-yildiz">
                      <RatingStars rating={Number(comment.stars)} />
                    </span>
                    <span className="yorum-kullanici">
                      {comment.first_name} {comment.last_name}
                    </span>
                  </div>
                  <span className="yorum-tarih">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="yorum-baslik">{comment.title}</p>
                <p className="yorum-metin">{comment.comment}</p>
              </div>
            </div>
          ))}
          <div className="pagination">
            {offset > 0 && (
              <button onClick={handlePreviousPage}>&lt;</button>
            )}
            <span>{currentPage}</span>
            {commentCount > offset + limit && (
              <>
                {currentPage + 1}
                <button onClick={handleNextPage}>&gt;</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Bu ürün için henüz yorum yapılmamış.</p>
      )}
      <Bestseller/>
    </div>
  );
};

export default YorumGrafik;