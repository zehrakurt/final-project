import './bfooter.css'
import { Link } from "react-router-dom";
import product from '../routes/productdetail/productdetail'

export default function Bfooter() {
  return (
    <div className='ftr'> 
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4">
          
     
          <div>
            <ul className="footer-menu">
              <li><img className='footer-logo' src="/images/LOGO_Siyah.png" alt="Logo" /></li>
              <li className="footer-menu-item"><Link to="contact">İletişim</Link></li>
              <li className="footer-menu-item"><Link to="about">Hakkımızda</Link></li>
              <li className="footer-menu-item"><Link to="sss">Sıkça Sorulan Sorular</Link></li>
              <li className="footer-menu-item">KVKK</li>
              <li className="footer-menu-item">Çalışma İlkelerimiz</li>
              <li className="footer-menu-item">Satış Sözleşmesi</li>
              <li className="footer-menu-item">Garanti ve İade Koşulları</li>
              <li className="footer-menu-item">Gerçek Müşteri Yorumları</li>
              <li className="footer-menu-item">Blog</li>
            </ul>
          </div>


          <div>
            <ul className="footer-menu">
              <li className="footer-menu-title">Kategoriler</li>
              <li className="footer-menu-item"><Link to="">Protein</Link></li>
              <li className="footer-menu-item">Spor Gıdaları</li>
              <li className="footer-menu-item">Sağlık</li>
              <li className="footer-menu-item">Gıda</li>
              <li className="footer-menu-item">Vitamin</li>
              <li className="footer-menu-item">Aksesuar</li>
              <li className="footer-menu-item">Tüm Ürünler</li>
              <li className="footer-menu-item">Lansmana Özel Fırsatlar</li>
            </ul>
          </div>

    
          <div>
            <ul className="footer-menu">
              <li className="footer-menu-title">Popüler Ürünler</li>
              <li className="footer-menu-item">
                <li >Whey Protein</li>
              </li>
              <li className="footer-menu-item">Cream of Rice</li>
              <li className="footer-menu-item">Creatine</li>
              <li className="footer-menu-item">BCAA+</li>
              <li className="footer-menu-item">Pre-Workout</li>
              <li className="footer-menu-item">Fitness Paketi</li>
              <li className="footer-menu-item">Collagen</li>
              <li className="footer-menu-item">Günlük Vitamin Paketi</li>
              <li className="footer-menu-item">ZMA</li>
            </ul>
          </div>

        </div>
        <p className='footer-copy'>Copyright © - Tüm Hakları Saklıdır.</p>
      </div>
    </div>
  );
}
