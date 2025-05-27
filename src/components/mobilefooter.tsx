import { Link } from "react-router-dom";
import CollapsibleSection from './collapsibleSection';
import './mobilefooter.css';

export default function MobileFooter() {
  return (
    <>
    <div className='hdr-58'>
      <img className='logo5' src="/images/LOGO_Siyah.png" alt="Logo" />
      
      <CollapsibleSection className='js-ntr' title="OJS Nutrition">
        <ul>
          <li><Link to={`contact`}>İletişim</Link></li>
          <li><Link to={`about`}>Hakkımızda</Link></li>
          <li><Link to={`sss`}>Sıkça Sorulan Sorular</Link></li>
          <li>KVKK</li>
          <li>Çalışma İlkelerimiz</li>
          <li>Satış Sözleşmesi</li>
          <li>Garanti ve İade Koşulları</li>
          <li>Gerçek Müşteri Yorumları</li>
          <li>Blog</li>
        </ul>
      </CollapsibleSection>

      <CollapsibleSection className='js-ntr' title="Kategoriler">
      <ul>
        <li><Link to={`protein`}>Protein</Link></li>
        <li>Spor Gıdaları</li>
        <li>Sağlık</li>
        <li>Gıda</li>
        <li>Vitamin</li>
        <li>Aksesuar</li>
        <li>Tüm Ürünler</li>
        <li>Lansmana Özel Fırsatlar</li>
    </ul>
      </CollapsibleSection>

      <CollapsibleSection className='js-ntr' title="Popüler Ürünler">
      <ul>
    <li><Link to={`productdetail`}>Whey Protein</Link></li>
    <li>Cream of Rice</li>
    <li>Creatine</li>
    <li>BCAA+</li>
    <li>Pre-Workout</li>
    <li>Fitness Paketi</li>
    <li>Collagen</li>
    <li>Günlük Vitamin Paketi</li>
    <li className="mb4">ZMA</li>
    </ul>
      </CollapsibleSection>
      <p className="cpr-77">Copyright © - Tüm Hakları Saklıdır.</p>
    </div>
   
    </>
  );
}
