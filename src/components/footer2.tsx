
import './footer2.css';

export default function Footer2() {
  return (
    <div className='footerbslk'>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row  md:items-center gap-4">
          <div className="flex flex-col  md:items-start">
            <div className="flex items-center">
              <img className='svg-1' src="/images/SVG.png" alt="" />
              <span className='forspan ml-2'>(140.000+)</span>
            </div>
            <p className='lab-1'>
              LABORATUVAR TESTLİ ÜRÜNLER <br /> 
              AYNI GÜN & ÜCRETSİZ KARGO <br /> 
              MEMNUNİYET GARANTİSİ
            </p>
          </div>
          <p className='urn-1'>
            200.000'den fazla ürün yorumumuza dayanarak, <br />
            ürünlerimizi seveceğinize eminiz. Eğer herhangi <br />
            bir sebeple memnun kalmazsan, bizimle iletişime <br />
            geçtiğinde çözüme kavuşturacağız.
          </p>
        </div>
      </div>
    </div>
  );
}
