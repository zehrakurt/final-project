import React, { useEffect, useState,useRef } from "react";
import "./Addaddress.css";
import '../Profile/Profile.css';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
    CreateNewAddress,
    DeleteMyAddress,
    EditMyAddress,
    GetAllMyAddress,
    GetCountries,
    GetRegionsByCountry,
    GetSubRegionsByRegion,
} from "../signup/auth.ts";
import {
    RegionType,
    CountriesType,
    SubRegionType,
    AllAddressType,
    AddressPayloadType,
} from "../signup/address-types.ts";
import { Link } from 'react-router-dom';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getAccessToken } from "../signup/storage.ts";

export default function MyAccount() {
    const access_token = getAccessToken();
    if (!access_token) {
        // Access token yoksa veya geçersizse hata fırlat.
        // Gerçek bir uygulamada bu, kullanıcıyı login sayfasına yönlendirebilir.
        throw new Error("Access token is invalid");
    }
     const addressWrapperRef = useRef<HTMLDivElement>(null); // Ref tanımlayın

 useEffect(() => {
    // Sayfa yüklendiğinde (component mount edildiğinde) en üste kaydır
    const scrollToTop = () => {
        window.scrollTo(0, 0);
        if (addressWrapperRef.current) {
            addressWrapperRef.current.scrollTop = 0;
        }
    };

    // DOM'un güncellenmesi için küçük bir gecikme ekleyebiliriz
    // Bu genellikle resimler veya diğer medya yüklendiğinde faydalı olur.
    const timeoutId = setTimeout(scrollToTop, 100); // 100ms gecikme

    return () => clearTimeout(timeoutId); // Temizlik fonksiyonu
}, []);
    // State Tanımlamaları
    const [countries, setCountries] = useState<CountriesType | null>(null);
    const [countriesLoading, setCountriesLoading] = useState(true);
    const [countriesError, setCountriesError] = useState<string | null>(null);

    const [region, setRegion] = useState<RegionType | null>(null);
    const [regionLoading, setRegionLoading] = useState(false);
    const [regionError, setRegionError] = useState<string | null>(null);

    const [subRegion, setsubRegion] = useState<SubRegionType | null>(null);
    const [subRegionLoading, setSubRegionLoading] = useState(false);
    const [subRegionError, setSubRegionError] = useState<string | null>(null);

    const [address, setAddress] = useState<AllAddressType | null>(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [addressError, setAddressError] = useState<string | null>(null);

    const [addressId, setaddressId] = useState<string>(""); // Düzenlenecek adresin ID'si

    // Seçilen ülke, şehir, ilçe isimlerini tutan state'ler
    const [selectedCountry, setselectedCountry] = useState<string | null>();
    const [selectedRegion, setselectedRegion] = useState<string | null>();
    const [selectedSubRegion, setselectedSubRegion] = useState<string | null>();

    // Adres olup olmadığını kontrol eden state
    const [isAddress, setisAddress] = useState<boolean>(false);

    // Modal kontrol state'leri
    const [handleEditAddress, setHandleEditAddress] = useState<boolean>(false); // Adres Düzenle modalı için
    const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState<boolean>(false); // Yeni Adres Ekle modalı için

    // React Hook Form başlatma
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<AddressPayloadType>();

    // İlk yüklemede ülkeleri ve kayıtlı adresleri getir
    useEffect(() => {
        const fetchCountries = async () => {
            setCountriesLoading(true);
            setCountriesError(null);
            try {
                const data = await GetCountries();
                setCountries({ data: { results: data } });
                setCountriesLoading(false);
            } catch (error: any) {
                setCountriesError("Ülkeler yüklenirken bir hata oluştu.");
                setCountriesLoading(false);
            }
        };

        const fetchAllMyAddress = async () => {
            setAddressLoading(true);
            setAddressError(null);
            try {
                const response = await GetAllMyAddress();
                setAddress(response);
                // Eğer adres varsa isAddress'i true yap, yoksa false
                setisAddress(response?.data?.count > 0);
                setAddressLoading(false);
            } catch (error: any) {
                setAddressError("Adresler yüklenirken bir hata oluştu.");
                setAddressLoading(false);
            }
        };

        fetchCountries();
        fetchAllMyAddress();
    }, []); // Sadece bir kere çalışır

    // selectedCountry değiştiğinde şehirleri getir
    useEffect(() => {
        if (selectedCountry) {
            const fetchRegions = async () => {
                setRegionLoading(true);
                setRegionError(null);
                try {
                    const data = await GetRegionsByCountry(selectedCountry);
                    setRegion({ data: { results: data } });
                    setRegionLoading(false);
                } catch (error: any) {
                    setRegionError("Şehirler yüklenirken bir hata oluştu.");
                    setRegionLoading(false);
                    setRegion(null); // Hata durumunda şehirleri sıfırla
                }
            };
            fetchRegions();
        } else {
            setRegion(null); // Ülke seçili değilse şehirleri sıfırla
        }
    }, [selectedCountry]); // selectedCountry değiştiğinde çalışır

    // selectedRegion değiştiğinde ilçeleri getir
    useEffect(() => {
        if (selectedRegion) {
            const fetchSubRegions = async () => {
                setSubRegionLoading(true);
                setSubRegionError(null);
                try {
                    const data = await GetSubRegionsByRegion(selectedRegion);
                    setsubRegion({ data: { results: data } });
                    setSubRegionLoading(false);
                } catch (error: any) {
                    setSubRegionError("İlçeler yüklenirken bir hata oluştu.");
                    setSubRegionLoading(false);
                    setsubRegion(null); // Hata durumunda ilçeleri sıfırla
                }
            };
            fetchSubRegions();
        } else {
            setsubRegion(null); // Şehir seçili değilse ilçeleri sıfırla
        }
    }, [selectedRegion]); // selectedRegion değiştiğinde çalışır

    // Yeni adres oluşturma submit handler'ı
    const addressSubmit: SubmitHandler<AddressPayloadType> = async (data) => {
        try {
            await CreateNewAddress(data);
            const renewedAddress = await GetAllMyAddress(); // Adres listesini yenile
            setAddress(renewedAddress);
            setisAddress(true); // Yeni adres eklendiği için isAddress'i true yap
            reset(); // Formu sıfırla
            setIsNewAddressModalOpen(false); // Yeni adres modalını kapat
            alert("Adres başarıyla oluşturuldu!");
        } catch (error: any) {
            console.error("Adres oluşturulurken hata:", error);
            alert("Adres oluşturulurken bir hata oluştu.");
        }
    };

    // Adres silme fonksiyonu
    const deleteMyAddress = async (idToDelete: string) => {
        try {
            await DeleteMyAddress(idToDelete);
            const renewedAddress = await GetAllMyAddress(); // Adres listesini yenile
            setAddress(renewedAddress);
            // Eğer hiç adres kalmadıysa isAddress'i false yap
            setisAddress(renewedAddress?.data?.count > 0);
            alert("Adres başarıyla silindi!");
        } catch (error: any) {
            console.error("Adres silinirken hata:", error);
            alert("Adres silinirken bir hata oluştu.");
        }
    };

    // Adres düzenleme submit handler'ı
    const editMyAddress: SubmitHandler<AddressPayloadType> = async (data) => {
        try {
            const response = await EditMyAddress({ data, addressId }); // addressId'yi kullan
            if (response?.status === "success") {
                setHandleEditAddress(false); // Düzenleme modalını kapat
                const renewedAddress = await GetAllMyAddress(); // Adres listesini yenile
                setAddress(renewedAddress);
                alert("Adres başarıyla düzenlendi!");
            } else {
                alert("Adres düzenlenirken bir hata oluştu.");
            }
        } catch (error: any) {
            console.error("Adres düzenlenirken hata:", error);
            alert("Adres düzenlenirken bir hata oluştu.");
        }
    };

    // Yüklenme durumları
    if (countriesLoading || addressLoading) {
        return <div>Yükleniyor...</div>;
    }

    // Hata durumları
    if (countriesError || addressError) {
        return <div>Hata oluştu: {countriesError || addressError}</div>;
    }

    return (
        <div className="container mx-auto grid grid-cols-12 " ref={addressWrapperRef}>
            <div className="col-span-2">
                <div className="profile-header-container">
                    <div className="profile-links-container">
                        <Link to="/profile" className="profile-title-link profile-link-item">
                            <img src="/images/13.png" alt="Hesabım İkonu" className="profile-title-icon" />
                            <p className="profile-section-title">Hesabım</p>
                        </Link>
                        <Link to="/orders" className="profile-title-link profile-link-item">
                            <img src="/images/14.png" alt="Siparişlerim İkonu" className="profile-title-icon" />
                            <p className="profile-section-title">Siparişlerim</p>
                        </Link>
                        <Link to="/add-address" className="profile-title-link profile-link-item">
                            <img src="/images/15.png" alt="Adreslerim İkonu" className="profile-title-icon" />
                            <p className="profile-section-title">Adreslerim</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="col-span-10">
                <div className="address-wrapper" >
                    {/* Kayıtlı adresler varsa listeyi göster */}
                    {isAddress && address?.data?.results?.length > 0 ? (
                        <>
                            <div className="saved-address-wrapper" style={{ marginBottom: '20px' }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3>Kayıtlı Adresler</h3>
                                    <button
                                        className="a2"
                                        onClick={() => {
                                            setIsNewAddressModalOpen(true); // Sadece yeni adres modalını aç
                                            setHandleEditAddress(false); // Düzenleme modalını kapat
                                            reset(); // Formu sıfırla (yeni giriş için)
                                            setselectedCountry(null); // Seçili ülkeyi sıfırla
                                            setselectedRegion(null); // Seçili şehri sıfırla
                                            setselectedSubRegion(null); // Seçili ilçeyi sıfırla
                                        }}
                                    >
                                        + Yeni Adres Ekle
                                    </button>
                                </div>
                                {addressLoading ? (
                                    <div>Adresler yükleniyor...</div>
                                ) : addressError ? (
                                    <div className="error-message">{addressError}</div>
                                ) : (
                                    address?.data?.results?.map((a, index) => (
                                        <div key={index} className="address-box" style={{ marginBottom: '17px' }}> {/* Buraya eklendi */}
                                            <div className="address-details">
                                                <div className="address-title">{a.title}</div>
                                                <div className="address-line">{`${a.full_address}, ${a.apartment_no || ''}`.trimEnd(', ')}</div>
                                                <div className="address-location">
                                                    {`${a.subregion?.name || ''}, ${a.region?.name || ''}, ${a.country?.name || ''}`.trimEnd(', ')}
                                                </div>
                                            </div>
                                            <div className="address-actions">
                                                <button
                                                    onClick={() => deleteMyAddress(a.id)}
                                                    className="icon-button delete-button"
                                                    title="Sil"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setaddressId(a.id);
                                                        // Düzenlenecek adresin verilerini forma yükle
                                                        reset({
                                                            title: a.title,
                                                            first_name: a.first_name,
                                                            last_name: a.last_name,
                                                            full_address: a.full_address,
                                                            country_id: a.country_id,
                                                            region_id: a.region_id,
                                                            subregion_id: a.subregion_id,
                                                            phone_number: a.phone_number,
                                                            apartment_no: a.apartment_no, // apartment_no da eklenmeli
                                                        });
                                                        setselectedCountry(a.country?.name || null);
                                                        setselectedRegion(a.region?.name || null);
                                                        setselectedSubRegion(a.subregion?.name || null);
                                                        setHandleEditAddress(true); // Düzenleme modalını aç
                                                        setIsNewAddressModalOpen(false); // Yeni adres modalını kapat
                                                    }}
                                                    className="icon-button edit-button"
                                                    title="Düzenle"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        // Kayıtlı adres yoksa veya isAddress false ise yeni adres ekleme formunu göster
                        // Bu kısım artık modal içinde değil, direkt sayfa içinde gösteriliyor.
                        // Eğer bu formun da modalda açılmasını istiyorsanız, aşağıdaki modal yapısını kullanmalısınız.
                        <div className="new-address-form-container">
                            {!isAddress && <h3 className="mb-4 info-message"><p>Kayıtlı Adresiniz Bulunmamaktadır, Lütfen Adres Ekleyiniz</p></h3>}
                            {/* Bu formun da modalda açılmasını istiyorsanız, aşağıdaki modal yapısını kullanın */}
                            {/* <AddressFormContent
                                register={register}
                                control={control}
                                errors={errors}
                                countries={countries}
                                countriesLoading={countriesLoading}
                                countriesError={countriesError}
                                region={region}
                                regionLoading={regionLoading}
                                regionError={regionError}
                                subRegion={subRegion}
                                subRegionLoading={subRegionLoading}
                                subRegionError={subRegionError}
                                selectedCountry={selectedCountry}
                                setselectedCountry={setselectedCountry}
                                selectedRegion={selectedRegion}
                                setselectedRegion={setselectedRegion}
                                selectedSubRegion={selectedSubRegion}
                                setselectedSubRegion={setselectedSubRegion}
                                onSubmit={handleSubmit(addressSubmit)} // Yeni adres ekleme submit'i
                                isEditMode={false} // Yeni adres modu
                                onClose={() => setIsNewAddressModalOpen(false)}
                            /> */}
                            {/* Eğer adres yoksa direkt formu gösteriyorsunuz, modalda değil. */}
                            {/* Bu formun da modalda açılmasını istiyorsanız, aşağıdaki `isNewAddressModalOpen` koşulunu kullanın */}
                            {/* Aşağıdaki form, eğer hiç adres yoksa ve modal açılmamışsa görünür. */}
                            {/* Eğer yeni adres ekle butonuna basıldığında modalda açılmasını istiyorsanız, bu kısmı kaldırıp aşağıdaki modal yapısını kullanın. */}
                            <form onSubmit={handleSubmit(addressSubmit)} className="address-form">
                                <label className="address-title-label">
                                    *Adres Başlığı
                                </label>
                                <input
                                    {...register("title", { required: "Adres başlığı zorunludur." })}
                                    id="address-title-input"
                                    type="text"
                                    placeholder="ev,iş vb..."
                                    className="address-title-input"
                                />
                                {errors.title && <p className="error-message">{errors.title.message}</p>}

                                <label className="address-firstName-label">
                                    *Ad
                                </label>
                                <input
                                    {...register("first_name", { required: "Adınız zorunludur." })}
                                    id="address-firstName-input"
                                    type="text"
                                    className="address-firstName-input"
                                />
                                {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}

                                <label className="address-lastName-label">
                                    *Soyad
                                </label>
                                <input
                                    {...register("last_name", { required: "Soyadınız zorunludur." })}
                                    id="address-lastName-input"
                                    type="text"
                                    className="address-lastName-input"
                                />
                                {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}

                                <label className="address-label">
                                    *Adres
                                </label>
                                <input
                                    {...register("full_address", { required: "Adres bilgisi zorunludur." })}
                                    id="address-input"
                                    type="text"
                                    className="address-input"
                                />
                                {errors.full_address && <p className="error-message">{errors.full_address.message}</p>}

                               

                                <label className="address-city-label">
                                    *Ülke
                                </label>
                                <select
                                    {...register("country_id", {
                                        required: "Lütfen bir ülke seçin.",
                                        setValueAs: (value) => parseInt(value, 10),
                                    })}
                                    id="address-city-input"
                                    onChange={(e) => {
                                        const selectedCountryId = countries?.data?.results?.find(
                                            (country) => country.id === Number(e.target.value)
                                        );
                                        setselectedCountry(
                                            selectedCountryId ? selectedCountryId.name : null
                                        );
                                        setselectedRegion(null);
                                        setselectedSubRegion(null);
                                    }}
                                    defaultValue=""
                                    className="address-city-input"
                                >
                                    <option value="" disabled>Ülke Seçin</option>
                                    {countries?.data?.results?.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                                {countriesLoading && <div>Ülkeler yükleniyor...</div>}
                                {countriesError && <div className="error-message">{countriesError}</div>}
                                {errors.country_id && <p className="error-message">{errors.country_id.message}</p>}


                                <label className="address-state-label">
                                    *Şehir
                                </label>
                                <select
                                    {...register("region_id", {
                                        required: "Lütfen bir şehir seçin.",
                                        setValueAs: (value) => parseInt(value, 10),
                                    })}
                                    id="address-state-input"
                                    onChange={(e) => {
                                        const selectedRegionId = region?.data?.results?.find(
                                            (regionItem) => regionItem.id === Number(e.target.value)
                                        );
                                        setselectedRegion(
                                            selectedRegionId ? selectedRegionId.name : null
                                        );
                                        setselectedSubRegion(null);
                                    }}
                                    defaultValue=""
                                    className="address-state-input"
                                    disabled={!selectedCountry || regionLoading || regionError || !region?.data?.results}
                                >
                                    <option value="" disabled>Şehir Seçin</option>
                                    {region?.data?.results?.map((regionItem) => (
                                        <option key={regionItem.id} value={regionItem.id}>
                                            {regionItem.name}
                                        </option>
                                    ))}
                                </select>
                                {regionLoading && <div>Şehirler yükleniyor...</div>}
                                {regionError && <div className="error-message">{regionError}</div>}
                               
                                {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                {errors.region_id && <p className="error-message">{errors.region_id.message}</p>}


                                <label className="address-subregion-label">
                                    *İlçe
                                </label>
                                <select
                                    {...register("subregion_id", {
                                        required: "Lütfen bir ilçe seçin.",
                                        setValueAs: (value) => parseInt(value, 10),
                                    })}
                                    id="address-subregion-input"
                                    onChange={(e) => {
                                        const selectedSubregionId =
                                            subRegion?.data?.results?.find(
                                                (subregionItem) =>
                                                    subregionItem.id === Number(e.target.value)
                                            );
                                        setselectedSubRegion(
                                            selectedSubregionId ? selectedSubregionId.name : null
                                        );
                                    }}
                                    defaultValue=""
                                    className="address-subregion-input"
                                    disabled={!selectedRegion || subRegionLoading || subRegionError || !subRegion?.data?.results}
                                >
                                    <option value="" disabled>İlçe Seçin</option>
                                    {subRegion?.data?.results?.map((subRegionItem) => (
                                        <option key={subRegionItem.id} value={subRegionItem.id}>
                                            {subRegionItem.name}
                                        </option>
                                    ))}
                                </select>
                                {subRegionLoading && <div>İlçeler yükleniyor...</div>}
                                {subRegionError && <div className="error-message">{subRegionError}</div>}
                               
                                {selectedRegion && subRegion?.data?.results?.length === 0 && !subRegionLoading && !subRegionError && <div className="info-message">Bu şehirde ilçe bulunmuyor.</div>}
                                {errors.subregion_id && <p className="error-message">{errors.subregion_id.message}</p>}


                                <label className="address-phone-label">
                                    *Telefon
                                </label>
                                <Controller
                                    name="phone_number"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: "Telefon numarası zorunludur.",
                                    }}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <>
                                            <PhoneInput
                                                inputStyle={{
                                                    width: '100%',
                                                    padding: '12px 15px',
                                                    border: '1px solid #e5e5e5',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#F7F7F7',
                                                    fontSize: '16px',
                                                    color: '#222',
                                                    boxSizing: 'border-box',
                                                    fontFamily: 'Inter',
                                                    fontStyle: 'normal',
                                                    fontWeight: 400,
                                                    lineHeight: 'normal',
                                                    height: '50px',
                                                    paddingLeft: '45px',
                                                }}
                                                containerClass="address-phone-container"
                                                inputClass="address-phone-input"
                                                country={"tr"}
                                                value={value}
                                                onChange={(phone) => onChange(`+${phone}`)}
                                                inputProps={{
                                                    name: "phone_number",
                                                    required: true,
                                                   
                                                }}
                                            />
                                            {error && (
                                                <p className="error-message">
                                                    {error.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />

                                <div className="address-button-wrapper">
                                    <button
                                        type="submit"
                                        className="address-submit-button"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Yeni Adres Ekle Modalı */}
                    {isNewAddressModalOpen && (
                        <div className="modal-container" onClick={(e) => {
                            // Modal dışına tıklayınca kapanma
                            if (e.target.className === 'modal-container') {
                                setIsNewAddressModalOpen(false);
                            }
                        }}>
                            <div className="modal-wrapper">
                                <div className="modal-title-wrapper">
                                    <h5 className="modal-title">
                                        Yeni Adres Ekle
                                    </h5>
                                    <button
                                        className="modal-close-button"
                                        onClick={() => setIsNewAddressModalOpen(false)} // Kapatma butonu
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                <div className="modal-form-wrapper">
                                    <form
                                        onSubmit={handleSubmit(addressSubmit)} // Yeni adres submit fonksiyonu
                                        className="modal-form"
                                    >
                                        {/* Yeni Adres Formu Alanları - Kayıtlı adres yoksa gösterilen formun aynısı */}
                                        <label className="address-title-label">
                                            *Adres Başlığı
                                        </label>
                                        <input
                                            {...register("title", { required: "Adres başlığı zorunludur." })}
                                            id="new-address-title-input" // ID'yi benzersiz yapın
                                            type="text"
                                            placeholder="ev,iş vb..."
                                            className="address-title-input"
                                        />
                                        {errors.title && <p className="error-message">{errors.title.message}</p>}

                                        <label className="address-firstName-label">
                                            *Ad
                                        </label>
                                        <input
                                            {...register("first_name", { required: "Adınız zorunludur." })}
                                            id="new-address-firstName-input"
                                            type="text"
                                            className="address-firstName-input"
                                        />
                                        {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}

                                        <label className="address-lastName-label">
                                            *Soyad
                                        </label>
                                        <input
                                            {...register("last_name", { required: "Soyadınız zorunludur." })}
                                            id="new-address-lastName-input"
                                            type="text"
                                            className="address-lastName-input"
                                        />
                                        {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}

                                        <label className="address-label">
                                            *Adres
                                        </label>
                                        <input
                                            {...register("full_address", { required: "Adres bilgisi zorunludur." })}
                                            id="new-address-input"
                                            type="text"
                                            className="address-input"
                                        />
                                        {errors.full_address && <p className="error-message">{errors.full_address.message}</p>}

                                     
                                        <label className="address-city-label">
                                            *Ülke
                                        </label>
                                        <select
                                            {...register("country_id", {
                                                required: "Lütfen bir ülke seçin.",
                                                setValueAs: (value) => parseInt(value, 10),
                                            })}
                                            id="new-address-country-input" // ID'yi benzersiz yapın
                                            onChange={(e) => {
                                                const selectedCountryId = countries?.data?.results?.find(
                                                    (country) => country.id === Number(e.target.value)
                                                );
                                                setselectedCountry(
                                                    selectedCountryId ? selectedCountryId.name : null
                                                );
                                                setselectedRegion(null);
                                                setselectedSubRegion(null);
                                            }}
                                            defaultValue=""
                                            className="address-city-input"
                                        >
                                            <option value="" disabled>Ülke Seçin</option>
                                            {countries?.data?.results?.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        {countriesLoading && <div>Ülkeler yükleniyor...</div>}
                                        {countriesError && <div className="error-message">{countriesError}</div>}
                                        {errors.country_id && <p className="error-message">{errors.country_id.message}</p>}


                                        <label className="address-state-label">
                                            *Şehir
                                        </label>
                                        <select
                                            {...register("region_id", {
                                                required: "Lütfen bir şehir seçin.",
                                                setValueAs: (value) => parseInt(value, 10),
                                            })}
                                            id="new-address-state-input" // ID'yi benzersiz yapın
                                            onChange={(e) => {
                                                const selectedRegionId = region?.data?.results?.find(
                                                    (regionItem) => regionItem.id === Number(e.target.value)
                                                );
                                                setselectedRegion(
                                                    selectedRegionId ? selectedRegionId.name : null
                                                );
                                                setselectedSubRegion(null);
                                            }}
                                            defaultValue=""
                                            className="address-state-input"
                                            disabled={!selectedCountry || regionLoading || regionError || !region?.data?.results}
                                        >
                                            <option value="" disabled>Şehir Seçin</option>
                                            {region?.data?.results?.map((regionItem) => (
                                                <option key={regionItem.id} value={regionItem.id}>
                                                    {regionItem.name}
                                                </option>
                                            ))}
                                        </select>
                                        {regionLoading && <div>Şehirler yükleniyor...</div>}
                                        {regionError && <div className="error-message">{regionError}</div>}
                                        {!selectedCountry && <div className="info-message">Önce ülke seçin.</div>}
                                        {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                        {errors.region_id && <p className="error-message">{errors.region_id.message}</p>}


                                        <label className="address-subregion-label">
                                            *İlçe
                                        </label>
                                        <select
                                            {...register("subregion_id", {
                                                required: "Lütfen bir ilçe seçin.",
                                                setValueAs: (value) => parseInt(value, 10),
                                            })}
                                            id="new-address-subregion-input" // ID'yi benzersiz yapın
                                            onChange={(e) => {
                                                const selectedSubregionId =
                                                    subRegion?.data?.results?.find(
                                                        (subregionItem) =>
                                                            subregionItem.id === Number(e.target.value)
                                                    );
                                                setselectedSubRegion(
                                                    selectedSubregionId ? selectedSubregionId.name : null
                                                );
                                            }}
                                            defaultValue=""
                                            className="address-subregion-input"
                                            disabled={!selectedRegion || subRegionLoading || subRegionError || !subRegion?.data?.results}
                                        >
                                            <option value="" disabled>İlçe Seçin</option>
                                            {subRegion?.data?.results?.map((subRegionItem) => (
                                                <option key={subRegionItem.id} value={subRegionItem.id}>
                                                    {subRegionItem.name}
                                                </option>
                                            ))}
                                        </select>
                                        {subRegionLoading && <div>İlçeler yükleniyor...</div>}
                                        {subRegionError && <div className="error-message">{subRegionError}</div>}
                                        {!selectedRegion && <div className="info-message">Önce şehir seçin.</div>}
                                        {selectedRegion && subRegion?.data?.results?.length === 0 && !subRegionLoading && !subRegionError && <div className="info-message">Bu şehirde ilçe bulunmuyor.</div>}
                                        {errors.subregion_id && <p className="error-message">{errors.subregion_id.message}</p>}


                                        <label className="address-phone-label">
                                            *Telefon
                                        </label>
                                        <Controller
                                            name="phone_number"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: "Telefon numarası zorunludur.",
                                            }}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <>
                                                    <PhoneInput
                                                        inputStyle={{
                                                            width: '100%',
                                                            padding: '12px 15px',
                                                            border: '1px solid #e5e5e5',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#F7F7F7',
                                                            fontSize: '16px',
                                                            color: '#222',
                                                            boxSizing: 'border-box',
                                                            fontFamily: 'Inter',
                                                            fontStyle: 'normal',
                                                            fontWeight: 400,
                                                            lineHeight: 'normal',
                                                            height: '50px',
                                                            paddingLeft: '45px',
                                                        }}
                                                        containerClass="address-phone-container"
                                                        inputClass="address-phone-input"
                                                        country={"tr"}
                                                        value={value}
                                                        onChange={(phone) => onChange(`+${phone}`)}
                                                        inputProps={{
                                                            name: "phone_number",
                                                            required: true,
                                                           
                                                        }}
                                                    />
                                                    {error && (
                                                        <p className="error-message">
                                                            {error.message}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        />

                                        <div className="address-button-wrapper">
                                            <button
                                                type="submit"
                                                className="address-submit-button"
                                            >
                                                Kaydet
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Adres Düzenle Modalı */}
                    {handleEditAddress && (
                        <div className="modal-container" onClick={(e) => {
                            if (e.target.className === 'modal-container') {
                                setHandleEditAddress(false);
                            }
                        }}>
                            <div className="modal-wrapper">
                                <div className="modal-title-wrapper">
                                    <h5 className="modal-title">
                                        Adresi Düzenle
                                    </h5>
                                    <button
                                        className="modal-close-button"
                                        onClick={() => setHandleEditAddress(false)}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                <div className="modal-form-wrapper">
                                    <form
                                        onSubmit={handleSubmit(editMyAddress)} // Adres düzenleme submit fonksiyonu
                                        className="modal-form"
                                    >
                                        {/* Adres Düzenleme Formu Alanları - Mevcut formun aynısı */}
                                        <label className="address-title-label">
                                            *Adres Başlığı
                                        </label>
                                        <input
                                            {...register("title", { required: "Adres başlığı zorunludur." })}
                                            id="edit-address-title-input" // ID'yi benzersiz yapın
                                            type="text"
                                            placeholder="ev,iş vb..."
                                            className="address-title-input"
                                        />
                                        {errors.title && <p className="error-message">{errors.title.message}</p>}

                                        <label className="address-firstName-label">
                                            *Ad
                                        </label>
                                        <input
                                            {...register("first_name", { required: "Adınız zorunludur." })}
                                            id="edit-address-firstName-input"
                                            type="text"
                                            className="address-firstName-input"
                                        />
                                        {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}

                                        <label className="address-lastName-label">
                                            *Soyad
                                        </label>
                                        <input
                                            {...register("last_name", { required: "Soyadınız zorunludur." })}
                                            id="edit-address-lastName-input"
                                            type="text"
                                            className="address-lastName-input"
                                        />
                                        {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}

                                        <label className="address-label">
                                            *Adres
                                        </label>
                                        <input
                                            {...register("full_address", { required: "Adres bilgisi zorunludur." })}
                                            id="edit-address-input"
                                            type="text"
                                            className="address-input"
                                        />
                                        {errors.full_address && <p className="error-message">{errors.full_address.message}</p>}

                                        
                                       
                                        <label className="address-city-label">
                                            *Ülke
                                        </label>
                                        <select
                                            {...register("country_id", {
                                                required: "Lütfen bir ülke seçin.",
                                                setValueAs: (value) => parseInt(value, 10),
                                            })}
                                            id="edit-address-country-input"
                                            onChange={(e) => {
                                                const selectedCountryId = countries?.data?.results?.find(
                                                    (country) => country.id === Number(e.target.value)
                                                );
                                                setselectedCountry(
                                                    selectedCountryId ? selectedCountryId.name : null
                                                );
                                                setselectedRegion(null);
                                                setselectedSubRegion(null);
                                            }}
                                            defaultValue=""
                                            className="address-city-input"
                                        >
                                            <option value="" disabled>Ülke Seçin</option>
                                            {countries?.data?.results?.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        {countriesLoading && <div>Ülkeler yükleniyor...</div>}
                                        {countriesError && <div className="error-message">{countriesError}</div>}
                                        {errors.country_id && <p className="error-message">{errors.country_id.message}</p>}


                                        <label className="address-state-label">
                                            *Şehir
                                        </label>
                                        <select
                                            {...register("region_id", {
                                                required: "Lütfen bir şehir seçin.",
                                                setValueAs: (value) => parseInt(value, 10),
                                            })}
                                            id="edit-address-state-input"
                                            onChange={(e) => {
                                                const selectedRegionId = region?.data?.results?.find(
                                                    (regionItem) => regionItem.id === Number(e.target.value)
                                                );
                                                setselectedRegion(
                                                    selectedRegionId ? selectedRegionId.name : null
                                                );
                                                setselectedSubRegion(null);
                                            }}
                                            defaultValue=""
                                            className="address-state-input"
                                            disabled={!selectedCountry || regionLoading || regionError || !region?.data?.results}
                                        >
                                            <option value="" disabled>Şehir Seçin</option>
                                            {region?.data?.results?.map((regionItem) => (
                                                <option key={regionItem.id} value={regionItem.id}>
                                                    {regionItem.name}
                                                </option>
                                            ))}
                                        </select>
                                        {regionLoading && <div>Şehirler yükleniyor...</div>}
                                        {regionError && <div className="error-message">{regionError}</div>}
                                        {!selectedCountry && <div className="info-message">Önce ülke seçin.</div>}
                                        {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                        {errors.region_id && <p className="error-message">{errors.region_id.message}</p>}


                                        <label className="address-subregion-label">
                                            *İlçe
                                        </label>
                                        <select
                                            {...register("subregion_id", {
                                                required: "Lütfen bir ilçe seçin.",
                                                setValueAs: (value) => parseInt(value, 10),
                                            })}
                                            id="edit-address-subregion-input"
                                            onChange={(e) => {
                                                const selectedSubregionId =
                                                    subRegion?.data?.results?.find(
                                                        (subregionItem) =>
                                                            subregionItem.id === Number(e.target.value)
                                                    );
                                                setselectedSubRegion(
                                                    selectedSubregionId ? selectedSubregionId.name : null
                                                );
                                            }}
                                            defaultValue=""
                                            className="address-subregion-input"
                                            disabled={!selectedRegion || subRegionLoading || subRegionError || !subRegion?.data?.results}
                                        >
                                            <option value="" disabled>İlçe Seçin</option>
                                            {subRegion?.data?.results?.map((subRegionItem) => (
                                                <option key={subRegionItem.id} value={subRegionItem.id}>
                                                    {subRegionItem.name}
                                                </option>
                                            ))}
                                        </select>
                                        {subRegionLoading && <div>İlçeler yükleniyor...</div>}
                                        {subRegionError && <div className="error-message">{subRegionError}</div>}
                                        {!selectedRegion && <div className="info-message">Önce şehir seçin.</div>}
                                        {selectedRegion && subRegion?.data?.results?.length === 0 && !subRegionLoading && !subRegionError && <div className="info-message">Bu şehirde ilçe bulunmuyor.</div>}
                                        {errors.subregion_id && <p className="error-message">{errors.subregion_id.message}</p>}


                                        <label className="address-phone-label">
                                            *Telefon
                                        </label>
                                        <Controller
                                            name="phone_number"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: "Telefon numarası zorunludur.",
                                            }}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <>
                                                    <PhoneInput
                                                        inputStyle={{
                                                            width: '100%',
                                                            padding: '12px 15px',
                                                            border: '1px solid #e5e5e5',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#fff', // Düzenleme modunda farklı renk olabilir
                                                            fontSize: '16px',
                                                            color: '#222',
                                                            boxSizing: 'border-box',
                                                            fontFamily: 'Inter',
                                                            fontStyle: 'normal',
                                                            fontWeight: 400,
                                                            lineHeight: 'normal',
                                                            height: 'auto', // Auto height for better responsiveness
                                                            paddingLeft: '45px',
                                                        }}
                                                        containerClass="address-phone-container"
                                                        inputClass="address-phone-input"
                                                        country={"tr"}
                                                        value={value}
                                                        onChange={(phone) => onChange(`+${phone}`)}
                                                        inputProps={{
                                                            name: "phone_number",
                                                            required: true,
                                                      
                                                        }}
                                                    />
                                                    {error && (
                                                        <p className="error-message">
                                                            {error.message}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        />

                                        <div className="address-button-wrapper">
                                            <button
                                                type="submit"
                                                className="address-submit-button"
                                            >
                                                Kaydet
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}