
import comments from '../../components/comments/mookdata2';

export default function Aboutyorum() {
  const allComments = comments.length;

  return (
    <>
      <div className='container mx-auto'>
        <div className="bas-1 flex items-center">
          <div className="comments-text-1 flex">
            <img src="/images/SVG.png" alt="" /><img src="/images/SVG.png" alt="" /><img src="/images/SVG.png" alt="" /><img src="/images/SVG.png" alt="" /><img src="/images/SVG.png" alt="" />
            <span className='ayr-5'>{allComments} yorum</span>
          </div>
        </div>
        <div className="ince-1">Ürün İncelemeleri</div>
        {comments.map(comment => (
          <div key={comment.id} className='card-2 mb-7'>
            <div className='pb-5 ml-7'>
            
              <div className='yorum-ust flex justify-between items-center mt-1'> {/* mt-1 ile başlıkla arasına boşluk */}
                <div>
                  <span className='starss'>{comment.likes}</span>
                  <span className='name-4'>{comment.author}</span>
                  <span className='all-7'>Doğrulanmış Müşteri</span>
                </div>
                <span className='tarih-yorum'>{comment.date}</span>
              </div>
                <span className='title-yeni'>{comment.title}</span> {/* Yeni başlık elementi */}
              <div className='mt-2 pl-0'>{comment.comment}</div> 
              
            </div>
          </div>
        ))}
      </div>
    </>
  );
}