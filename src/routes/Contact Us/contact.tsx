import './contact.css'
import İnput from './input'
import { useEffect } from "react";
export default function Contact() {

 useEffect(() => {

    window.scrollTo(0, 0);
  }, []); 



  return (
<>
<div className="all">
    <div className="container mx-auto"> 
<h2 className="first-h2">Bize Ulaşın</h2>
<İnput/>
<p className="dis-1">*Aynı gün kargo hafta içi 16:00, Cumartesi ise 11:00' a kadar verilen siparişler icin geçerlidir. <br/>
Siparişler kargoya verilince e-posta ve sms ile bilgilendirme yapılır.</p>
<p className='tlf-7'>Telefon ile <span className='tlf-span'>0850 303 29 89</span> numarasını arayarak da bizlere sesli mesaj bırakabilirsiniz . Sesli mesajlarınıza hafta içi saat <br/>
<span className='tlf-span'>09:00-17:00</span> arasında dönüş sağlanmaktadır.</p>

</div>
</div>



</>
  )
}
