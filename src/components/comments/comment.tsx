import { useRef } from 'react';
import comments from './mookdata2';
import './comment.css';
import { FaStar } from "react-icons/fa";

const CommentsCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <img className='ortimg' src="/images/6527895 1.png" alt="" />
      <div><img className='ortimg2' src="/images/Untitled.png" alt="" /></div>
      <div className="container mx-auto mt-6">
        <div className="info-bar bb">
          <div className="real-1">GERÇEK MÜŞTERİ YORUMLARI</div>

          <div className="stars-container-2 flex items-center space-x-2">
            <div className='flex bs'>
              <span className='stars-2 flex'><FaStar /><FaStar /><FaStar /></span>
              <span className='ttl'>7 Yorum</span>
            </div>
            <div>
              <button onClick={scrollLeft} className="right-arrow">‹</button>
              <button onClick={scrollRight} className="left-arrow">›</button>
            </div>
          </div>
        </div>

        <div className="carousel-container" ref={carouselRef}>
          {comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <div>
                <p className="text-sm text-gray-600 mt-3">{comment.date}</p>
                <p className="author-1 mt-2">{comment.author}</p>
                <p className="comment-text mt-2">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default CommentsCarousel;
