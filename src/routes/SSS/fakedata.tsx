export interface Question {
    id: number;
    question: string;
    answer: string;
    category: string;
}

export const fakeQuestionsData: Question[] = [
  
    { id: 1, question: 'Sitenize nasıl üye olabilirim?', answer: 'Sağ üst köşedeki "Üye Ol" bağlantısına tıklayarak adımları takip edebilirsiniz.', category: 'genel' },
    { id: 2, question: 'Şifremi unuttum, ne yapmalıyım?', answer: '"Giriş Yap" sayfasındaki "Şifremi Unuttum" bağlantısını kullanabilirsiniz.', category: 'genel' },
    { id: 3, question: 'İletişim bilgileriniz nelerdir?', answer: 'Bize info@example.com adresinden veya 0212 XXX XX XX numarasından ulaşabilirsiniz.', category: 'genel' },
    { id: 4, question: 'Çalışma saatleriniz nedir?', answer: 'Hafta içi 09:00 - 18:00 arası hizmet vermekteyiz.', category: 'genel' },
    { id: 5, question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', answer: 'Kredi kartı, banka havalesi ve kapıda ödeme seçeneklerimiz bulunmaktadır.', category: 'genel' },
    { id: 6, question: 'Veri güvenliğim nasıl sağlanıyor?', answer: 'SSL sertifikası ile tüm verileriniz şifrelenmektedir.', category: 'genel' },
    { id: 7, question: 'Gizlilik politikalarınız nelerdir?', answer: 'Gizlilik politikamıza web sitemizin ilgili bölümünden ulaşabilirsiniz.', category: 'genel' },
    { id: 8, question: 'Site haritanız var mı?', answer: 'Evet, site haritamıza en alt kısımdaki bağlantıdan erişebilirsiniz.', category: 'genel' },
    { id: 9, question: 'Hakkınızda daha fazla bilgi nerede bulabilirim?', answer: '"Hakkımızda" sayfamızı ziyaret edebilirsiniz.', category: 'genel' },
    { id: 10, question: 'Sitemizde hangi diller destekleniyor?', answer: 'Şu anda Türkçe ve İngilizce dillerini destekliyoruz.', category: 'genel' },

    { id: 11, question: 'Ürünlerinizde hangi malzemeler kullanılıyor?', answer: 'Ürün detay sayfalarında kullanılan malzemeler hakkında bilgi bulabilirsiniz.', category: 'ürünler' },
    { id: 12, question: 'Stokta olmayan ürünler ne zaman tekrar satışa sunulur?', answer: 'Stokta olmayan ürünlerin yeniden stok tarihi belirsizdir, lütfen takipte kalın.', category: 'ürünler' },
    { id: 13, question: 'Ürün iadesi nasıl yapılır?', answer: '"İade ve Değişim" politikamızı inceleyerek iade adımlarını öğrenebilirsiniz.', category: 'ürünler' },
    { id: 14, question: 'Hangi bedenleri sunuyorsunuz?', answer: 'Ürün detay sayfalarında mevcut beden seçeneklerini görebilirsiniz.', category: 'ürünler' },
    { id: 15, question: 'Ürünlerin garanti süresi ne kadar?', answer: 'Ürünlerin garanti süresi, ürün tipine göre değişiklik göstermektedir. Detaylar ürün açıklamasında yer almaktadır.', category: 'ürünler' },
    { id: 16, question: 'Toplu alımlarda indiriminiz var mı?', answer: 'Toplu alım talepleriniz için lütfen bizimle iletişime geçin.', category: 'ürünler' },
    { id: 17, question: 'Ürün fotoğrafları gerçeği yansıtıyor mu?', answer: 'Evet, ürün fotoğraflarımız orijinal ürünlerin en doğru şekilde yansıtılması için çekilmiştir.', category: 'ürünler' },
    { id: 18, question: 'Özel sipariş alıyor musunuz?', answer: 'Şu anda özel sipariş alamıyoruz.', category: 'ürünler' },
    { id: 19, question: 'Hediye paketi seçeneğiniz var mı?', answer: 'Evet, siparişiniz sırasında hediye paketi seçeneğini işaretleyebilirsiniz.', category: 'ürünler' },
    { id: 20, question: 'Ürün karşılaştırma özelliği var mı?', answer: 'Evet, ürün detay sayfalarındaki "Karşılaştır" butonunu kullanarak ürünleri karşılaştırabilirsiniz.', category: 'ürünler' },

    { id: 21, question: 'Kargo ücreti ne kadar?', answer: 'Kargo ücreti, sipariş tutarınıza ve teslimat adresinize göre değişiklik göstermektedir.', category: 'kargo' },
    { id: 22, question: 'Siparişimin kargoya verildiğini nasıl anlarım?', answer: 'Siparişiniz kargoya verildiğinde size bir e-posta ile takip numarası gönderilecektir.', category: 'kargo' },
    { id: 23, question: 'Tahmini teslimat süresi ne kadar?', answer: 'Tahmini teslimat süresi, teslimat adresinize bağlı olarak 1-5 iş günü arasında değişmektedir.', category: 'kargo' },
    { id: 24, question: 'Hangi kargo firmaları ile çalışıyorsunuz?', answer: 'Yurtiçi Kargo ve Aras Kargo ile çalışmaktayız.', category: 'kargo' },
    { id: 25, question: 'Yurtdışına gönderim yapıyor musunuz?', answer: 'Şu anda sadece Türkiye içine gönderim yapmaktayız.', category: 'kargo' },
    { id: 26, question: 'Adres değişikliği yapabilir miyim?', answer: 'Siparişiniz kargoya verilmeden önce adres değişikliği yapabilirsiniz. Lütfen bizimle iletişime geçin.', category: 'kargo' },
    { id: 27, question: 'Kargom hasarlı geldi, ne yapmalıyım?', answer: 'Hasarlı kargolar için lütfen kargo firması ile iletişime geçerek hasar tespit tutanağı düzenletin ve bize bildirin.', category: 'kargo' },
    { id: 28, question: 'Kapıda ödeme seçeneği var mı?', answer: 'Evet, belirli bir tutarın üzerindeki siparişlerinizde kapıda ödeme seçeneğimiz bulunmaktadır.', category: 'kargo' },
    { id: 29, question: 'Kargo takip numaramı nerede bulabilirim?', answer: 'Kargo takip numaranız, siparişiniz kargoya verildiğinde size gönderilen e-postada yer almaktadır.', category: 'kargo' },
    { id: 30, question: 'Teslimat sırasında nelere dikkat etmeliyim?', answer: 'Teslimat sırasında paketinizi kontrol ederek herhangi bir hasar olup olmadığını teyit edin.', category: 'kargo' },
];