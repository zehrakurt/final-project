
import './about.css'
import Aboutyorum from './aboutyorum'
import { useEffect } from "react";
export default function Aboutus() {
   useEffect(() => {
 
      window.scrollTo(0, 0);
    }, []);
  return (
    <>
      <div className='abt-1'> 
        <div className='container mx-auto'> 
          <h1 className='fit-1'>Sağlıklı ve Fit Yaşamayı Zevkli ve Kolay Hale Getirmek İçin Varız </h1>
          <p className="ag-1 mb-6">2016 yılından beri sporcu gıdaları, takviye edici gıdalar ve fonksiyonel gıdaları üreten bir firma olarak; müşterilerimize en kaliteli, lezzetli, tüketilmesi kolay ürünleri sunuyoruz.</p>
          <p className="ag-1 mb-6">Müşteri memnuniyeti ve sağlığı her zaman önceliğimiz olmuştur. Ürünlerimizde, yüksek kalite standartlarına bağlı olarak,  sporcuların ve sağlıklı yaşam tutkunlarının ihtiyaçlarına yönelik besleyici çözümler sunuyoruz. Ürün yelpazemizdeki protein tozları, aminoasitler, vitamin ve mineral takviyeleri ile spor performansınızı desteklemek için ideal besin değerlerini sunuyoruz.</p>
          <p className="ag-1 mb-6">Sizin için sadece en iyisinin yeterli olduğunu biliyoruz. Bu nedenle, inovasyon, kalite, sağlık ve güvenlik ilkelerimizi korurken, sürekli olarak ürünlerimizi geliştirmeye ve yenilikçi beslenme çözümleri sunmaya devam ediyoruz.</p>
          <p className='ag-1 mb-6'>Sporcu gıdaları konusunda lider bir marka olarak, sizin sağlığınıza ve performansınıza değer veriyoruz. Siz de spor performansınızı en üst seviyeye çıkarmak ve sağlıklı yaşam tarzınızı desteklemek</p>
          <p className='ag-1'>istiyorsanız, bize katılın ve en besleyici çözümlerimizle tanışın. Sağlıklı ve aktif bir yaşam için biz her zaman yanınızdayız.</p>
          <h1 className="bin-1">1.000.000+ den Fazla Mutlu Müşteri</h1>
          <p className='ag-1'>Sanatçılardan profesyonel sporculara, doktordan öğrencilere hayatın her alanında sağlıklı yaşamı ve beslenmeyi hedefleyen 1.000.000'den fazla kişiye ulaştık.</p>
          <h1 className="ser-1">Sertifikalarımız</h1>
          <div className="flex img-77 flex-wrap space-y-4 md:space-y-0">
            <img className="w-24 h-24 md:w-32 md:h-32" src="images/s1.png" alt="s1" />
            <img className="w-24 h-24 md:w-32 md:h-32" src="images/s2.png" alt="s2" />
            <img className="w-24 h-24 md:w-32 md:h-32" src="images/s3.png" alt="s3" />
            <img className="w-24 h-24 md:w-32 md:h-32" src="images/s4.png" alt="s4" />
            <img className="w-24 h-24 md:w-32 md:h-32" src="images/s5.png" alt="s5" />
            <img className="w-24 h-24 md:w-32 md:h-32" src="images/s6.png" alt="s6" />
          </div>
        </div>
      </div>
      <Aboutyorum/>
    </>
  )
}
