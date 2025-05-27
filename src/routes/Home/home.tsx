import Three2 from '../../components/three2';
import Bestseller from '../../components/bestseller';
import CommentsCarousel from '../../components/comments/comment';
import Footer2 from '../../components/footer2';
import './homemobile.css'
import Shop from '../../components/shop';
export default function Header() {
  return (
    <>  
    <Shop/>
      <div>
        <img className="banner" src="/images/banner.png" alt="" />
      </div>
      <Three2/>
      <Bestseller/>
      <CommentsCarousel/>
      <Footer2/>
    </>
  );
}
