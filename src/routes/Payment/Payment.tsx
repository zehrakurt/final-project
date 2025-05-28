import React, { useState, useEffect } from "react";
import { useCartStore } from "../../store/sepet.ts";
import {
    GetAllMyAddress,
    CreateNewAddress,
    DeleteMyAddress,
    EditMyAddress,
    GetCountries,
    GetRegionsByCountry,
    GetSubRegionsByRegion,
} from "../signup/auth.ts";
import {
    AllAddressType,
    ShippingMethod,
    RegionType,
    CountriesType,
    SubRegionType,
    AddressPayloadType,
} from "../signup/address-types.ts";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Paymentstyle.css'; 
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


const BASE_URL = 'https://fe1111.projects.academy.onlyjs.com/api/v1/orders/complete-shopping';
const STANDARD_SHIPPING_PRICE = 10;
const EXPRESS_SHIPPING_PRICE = 20;
const CASH_ON_DELIVERY_FEE = 39;
const CARD_ON_DELIVERY_FEE = 45;


const staticShippingMethods: ShippingMethod[] = [
    { name: "Standart Kargo", value: "standard", price: STANDARD_SHIPPING_PRICE, content: "3-5 iş günü" },
    { name: "Hızlı Kargo", value: "express", price: EXPRESS_SHIPPING_PRICE, content: "1-2 iş günü" },
];

const staticPaymentMethods = [
    { type: "credit_cart", name: "Kredi Kartı" },
    { type: "cash_at_door", name: "Kapıda Nakit Ödeme" },
    { type: "credit_cart_at_door", name: "Kapıda Kredi Kartı Ödeme" },
];


function safeParseFloat(value: any): number {
    if (typeof value === 'number') {
        return isNaN(value) ? 0 : value;
    }
    if (typeof value === 'string') {
        const match = value.match(/(\d+(\.\d+)?)/);
        if (match) {
            const parsed = parseFloat(match[1]);
            return isNaN(parsed) ? 0 : parsed;
        }
    }
    return 0;
}

const Payment: React.FC = () => {
    const bears = useCartStore((state) => state.bears);
    const rawTotalPrice = useCartStore((state) => state.totalPrice)();
    const totalPrice = safeParseFloat(rawTotalPrice);

    const totalItems = useCartStore((state) => state.totalItems)();
    const clearCart = useCartStore((state) => state.clearCart);
    const navigate = useNavigate();

    const [allAddresses, setAllAddresses] = useState<AllAddressType[] | null>(null);
    const [address, setAddress] = useState<AllAddressType | null>(null);
    const [currentStep, setCurrentStep] = useState(0); // İlk adım 0
    const [shippingMethods] = useState<ShippingMethod[]>(staticShippingMethods);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
    const [paymentChoice, setPaymentChoice] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [paymentMethods] = useState(staticPaymentMethods);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [extra, setExtra] = useState(0);


    const [cardDigits, setCardDigits] = useState("");
    const [cardExpirationMonth, setCardExpirationMonth] = useState("");
    const [cardExpirationYear, setCardExpirationYear] = useState("");
    const [cardSecurityCode, setCardSecurityCode] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardType, setCardType] = useState<string>("VISA");


    const [countries, setCountries] = useState<CountriesType | null>(null);
    const [countriesLoading, setCountriesLoading] = useState(true);
    const [countriesError, setCountriesError] = useState<string | null>(null);

    const [region, setRegion] = useState<RegionType | null>(null);
    const [regionLoading, setRegionLoading] = useState(false);
    const [regionError, setRegionError] = useState<string | null>(null);

    const [subRegion, setsubRegion] = useState<SubRegionType | null>(null);
    const [subRegionLoading, setSubRegionLoading] = useState(false);
    const [subRegionError, setSubRegionError] = useState<string | null>(null);

    const [selectedCountry, setselectedCountry] = useState<string | null>(null);
    const [selectedRegion, setselectedRegion] = useState<string | null>(null);
    const [selectedSubRegion, setselectedSubRegion] = useState<string | null>(null);

    const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState<boolean>(false);
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState<boolean>(false);
    const [addressToEdit, setAddressToEdit] = useState<AllAddressType | null>(null);

   
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<AddressPayloadType>();

   
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));


    
    const handleCardDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardDigits(e.target.value.replace(/\D/g, ''));
    };

 const handleCardExpirationYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCardExpirationYear(e.target.value); 
    };

    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedMethod = e.target.value;
        setPaymentChoice(selectedMethod);
        switch (selectedMethod) {
            case "cash_at_door":
                setExtra(CASH_ON_DELIVERY_FEE);
                break;
            case "credit_cart_at_door":
                setExtra(CARD_ON_DELIVERY_FEE);
                break;
            case "credit_cart":
                setExtra(0);
                break;
            default:
                setExtra(0);
                break;
        }
    };


    useEffect(() => {
        const fetchAddress = async () => {
            setLoading(true);
            try {
                const addressResponse = await GetAllMyAddress();
                if (addressResponse?.data?.results?.length) {
                    setAllAddresses(addressResponse.data.results);
                    const defaultAddress = addressResponse.data.results[0];
                    setAddress(defaultAddress);
                    setSelectedAddressId(defaultAddress.id.toString());
                    setAddressError(null);
                } else {
                    setAllAddresses([]); 
                    setAddressError("Kayıtlı adresiniz bulunmamaktadır. Lütfen adres ekleyiniz.");
                }
            } catch (error: any) {
                console.error("Adres alınamadı:", error);
                setAddressError("Adres bilgileri yüklenirken bir hata oluştu.");
                setAllAddresses([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, []);


    useEffect(() => {
        if (allAddresses && selectedAddressId) {
            const foundAddress = allAddresses.find(addr => addr.id.toString() === selectedAddressId);
            setAddress(foundAddress || null);
        }
    }, [selectedAddressId, allAddresses]);

   
    useEffect(() => {
        const fetchCountriesData = async () => {
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

        fetchCountriesData();
    }, []);

   
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
                    setRegion(null);
                }
            };
            fetchRegions();
        } else {
            setRegion(null);
        }
    }, [selectedCountry]);

   
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
                    setsubRegion(null);
                }
            };
            fetchSubRegions();
        } else {
            setsubRegion(null);
        }
    }, [selectedRegion]);


    const addressSubmit: SubmitHandler<AddressPayloadType> = async (data) => {
        try {
            delete data.apartment_no; 

            await CreateNewAddress(data);
            const renewedAddressResponse = await GetAllMyAddress(); 
            if (renewedAddressResponse?.data?.results?.length) {
                setAllAddresses(renewedAddressResponse.data.results);
                const newlyAddedAddress = renewedAddressResponse.data.results[renewedAddressResponse.data.results.length - 1];
                setAddress(newlyAddedAddress);
                setSelectedAddressId(newlyAddedAddress.id.toString());
                setAddressError(null); 
            }
            reset(); 
            setIsNewAddressModalOpen(false); 
          
        } catch (error: any) {
            console.error("Adres oluşturulurken hata:", error);
            
        }
    };

 
    const deleteMyAddress = async (idToDelete: string) => {
  
        const confirmDelete = window.confirm("Bu adresi silmek istediğinizden emin misiniz?");
        if (!confirmDelete) {
            return;
        }
        try {
            await DeleteMyAddress(idToDelete);
            const renewedAddress = await GetAllMyAddress(); 
            setAllAddresses(renewedAddress?.data?.results || null);
            if (selectedAddressId === idToDelete) {
                if (renewedAddress?.data?.results?.length > 0) {
                    const defaultAddress = renewedAddress.data.results[0];
                    setAddress(defaultAddress);
                    setSelectedAddressId(defaultAddress.id.toString());
                } else {
                    setAddress(null);
                    setSelectedAddressId(null);
                    setAddressError("Kayıtlı adresiniz bulunmamaktadır. Lütfen adres ekleyiniz.");
                }
            }
            
        } catch (error: any) {
            console.error("Adres silinirken hata:", error);
            
        }
    };

   
    const editMyAddress: SubmitHandler<AddressPayloadType> = async (data) => {
        try {
            if (!addressToEdit) {
                
                return;
            }
            delete data.apartment_no; 

            const response = await EditMyAddress({ data, addressId: addressToEdit.id.toString() });
            if (response?.status === "success") {
                setIsEditAddressModalOpen(false); 
                const renewedAddress = await GetAllMyAddress(); 
                setAllAddresses(renewedAddress?.data?.results || null);
                if (selectedAddressId === addressToEdit.id.toString()) {
                    const updatedAddress = renewedAddress?.data?.results?.find(addr => addr.id.toString() === addressToEdit.id.toString());
                    setAddress(updatedAddress || null);
                }
              
            } else {
                
            }
        } catch (error: any) {
            console.error("Adres düzenlenirken hata:", error);
           
        }
    };

 
    const goToNextStep = () => {
        if (currentStep === 0) {
            if (!selectedAddressId) {
                
                return;
            }
            if (allAddresses?.length === 0 && selectedAddressId === "new-address" && !isNewAddressModalOpen) {
               
                setIsNewAddressModalOpen(true);
                return;
            }
        } else if (currentStep === 1) {
            if (!selectedShippingMethod) {
              
                return;
            }
        }
        

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };


    const handleCompletePayment = async () => {
        if (!selectedAddressId || !paymentChoice) {

            return;
        }

        if (paymentChoice === "credit_cart") {
            if (!cardDigits || cardDigits.length < 13 || cardDigits.length > 16 || !cardExpirationMonth || !cardExpirationYear || !cardSecurityCode || !cardName) {
            
                return;
            }
        }

        setIsSubmitting(true);
        setFormSubmitted(true);

        const cardExpirationDate = paymentChoice === "credit_cart"
        ? `${cardExpirationMonth}-${cardExpirationYear.slice(-2)}`
        : undefined;

    const orderData = {
        address_id: selectedAddressId,
        payment_type: paymentChoice,
        ...(paymentChoice === "credit_cart" && {
            card_digits: cardDigits,
            card_expiration_date: cardExpirationDate,
            card_security_code: cardSecurityCode,
            card_type: cardType,
        }),
    };

        console.log("Gönderilecek Sipariş Verisi:", orderData);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error("Oturum bilgisi bulunamadı.");
            }

            const response = await axios.post(
                BASE_URL,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("Sipariş Başarılı:", response.data.data);
            setOrderNumber(response.data.data.order_no);
            clearCart();
            setCurrentStep(3); 

        } catch (error: any) {
            console.error("Sipariş Oluşturma Hatası:", error);
        } finally {
            setIsSubmitting(false);
            setFormSubmitted(false);
        }
    };


    const steps = ["Teslimat Adresi", "Kargo", "Ödeme", "Tamamlandı"];

 
    if (loading) {
        return <div className="text-center py-10">Yükleniyor...</div>;
    }


    if (addressError && !isNewAddressModalOpen && !isEditAddressModalOpen) {
        return (
            <div className="payment-container max-w-3xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Ödeme Sayfası</h1>
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">
                    <p className="text-red-500">
                        {addressError}
                        <span
                            onClick={() => setIsNewAddressModalOpen(true)}
                            className="underline text-blue-500 cursor-pointer ml-2"
                        >
                            Yeni adres eklemek için tıklayın.
                        </span>
                    </p>
                </div>
             
                {isNewAddressModalOpen && (
                    <div className="modal-container" onClick={(e) => {
                        if (e.target.className === 'modal-container') {
                            setIsNewAddressModalOpen(false);
                        }
                    }}>
                        <div className="modal-wrapper">
                            <div className="modal-title-wrapper">
                                <h5 className="modal-title">Yeni Adres Ekle</h5>
                                <button className="modal-close-button" onClick={() => setIsNewAddressModalOpen(false)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="modal-form-wrapper">
                                <form onSubmit={handleSubmit(addressSubmit)} className="modal-form">
                                    <label className="address-title-label">*Adres Başlığı</label>
                                    <input {...register("title", { required: "Adres başlığı zorunludur." })} id="payment-new-address-title-input" type="text" placeholder="ev,iş vb..." className="address-title-input" />
                                    {errors.title && <p className="error-message">{errors.title.message}</p>}

                                    <label className="address-firstName-label">*Ad</label>
                                    <input {...register("first_name", { required: "Adınız zorunludur." })} id="payment-new-address-firstName-input" type="text" className="address-firstName-input" />
                                    {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}

                                    <label className="address-lastName-label">*Soyad</label>
                                    <input {...register("last_name", { required: "Soyadınız zorunludur." })} id="payment-new-address-lastName-input" type="text" className="address-lastName-input" />
                                    {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}

                                    <label className="address-label">*Adres</label>
                                    <input {...register("full_address", { required: "Adres bilgisi zorunludur." })} id="payment-new-address-input" type="text" className="address-input" />
                                    {errors.full_address && <p className="error-message">{errors.full_address.message}</p>}

                                    <label className="address-city-label">*Ülke</label>
                                    <select
                                        {...register("country_id", { required: "Lütfen bir ülke seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                        id="payment-new-address-country-input"
                                        onChange={(e) => {
                                            const selectedCountryObj = countries?.data?.results?.find((country) => country.id === Number(e.target.value));
                                            setselectedCountry(selectedCountryObj ? selectedCountryObj.name : null);
                                            setselectedRegion(null);
                                            setselectedSubRegion(null);
                                        }}
                                        defaultValue=""
                                        className="address-city-input"
                                    >
                                        <option value="" disabled>Ülke Seçin</option>
                                        {countries?.data?.results?.map((country) => (
                                            <option key={country.id} value={country.id}>{country.name}</option>
                                        ))}
                                    </select>
                                    {countriesLoading && <div>Ülkeler yükleniyor...</div>}
                                    {countriesError && <div className="error-message">{countriesError}</div>}
                                    {errors.country_id && <p className="error-message">{errors.country_id.message}</p>}

                                    <label className="address-state-label">*Şehir</label>
                                    <select
                                        {...register("region_id", { required: "Lütfen bir şehir seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                        id="payment-new-address-state-input"
                                        onChange={(e) => {
                                            const selectedRegionObj = region?.data?.results?.find((regionItem) => regionItem.id === Number(e.target.value));
                                            setselectedRegion(selectedRegionObj ? selectedRegionObj.name : null);
                                            setselectedSubRegion(null);
                                        }}
                                        defaultValue=""
                                        className="address-state-input"
                                        disabled={!selectedCountry || regionLoading || regionError || !region?.data?.results}
                                    >
                                        <option value="" disabled>Şehir Seçin</option>
                                        {region?.data?.results?.map((regionItem) => (
                                            <option key={regionItem.id} value={regionItem.id}>{regionItem.name}</option>
                                        ))}
                                    </select>
                                    {regionLoading && <div>Şehirler yükleniyor...</div>}
                                    {regionError && <div className="error-message">{regionError}</div>}
                                    {!selectedCountry && <div className="info-message">Önce ülke seçin.</div>}
                                    {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                    {errors.region_id && <p className="error-message">{errors.region_id.message}</p>}

                                    <label className="address-subregion-label">*İlçe</label>
                                    <select
                                        {...register("subregion_id", { required: "Lütfen bir ilçe seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                        id="payment-new-address-subregion-input"
                                        onChange={(e) => {
                                            const selectedSubregionObj = subRegion?.data?.results?.find((subregionItem) => subregionItem.id === Number(e.target.value));
                                            setselectedSubRegion(selectedSubregionObj ? selectedSubregionObj.name : null);
                                        }}
                                        defaultValue=""
                                        className="address-subregion-input"
                                        disabled={!selectedRegion || subRegionLoading || subRegionError || !subRegion?.data?.results}
                                    >
                                        <option value="" disabled>İlçe Seçin</option>
                                        {subRegion?.data?.results?.map((subRegionItem) => (
                                            <option key={subRegionItem.id} value={subRegionItem.id}>{subRegionItem.name}</option>
                                        ))}
                                    </select>
                                    {subRegionLoading && <div>İlçeler yükleniyor...</div>}
                                    {subRegionError && <div className="error-message">{subRegionError}</div>}
                                    {!selectedRegion && <div className="info-message">Önce şehir seçin.</div>}
                                    {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                    {errors.subregion_id && <p className="error-message">{errors.subregion_id.message}</p>}

                                    <label className="address-phone-label">*Telefon</label>
                                    <Controller
                                        name="phone_number"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: "Telefon numarası zorunludur.", }}
                                        render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                            <>
                                                <PhoneInput
                                                    inputStyle={{ width: '100%', padding: '12px 15px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#F7F7F7', fontSize: '16px', color: '#222', boxSizing: 'border-box', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 400, }}
                                                    containerClass="address-phone-container"
                                                    inputClass="address-phone-input"
                                                    country={"tr"}
                                                    value={value}
                                                    onChange={(phone) => onChange(`+${phone}`)}
                                                    inputProps={{ name: "phone_number", required: true, autoFocus: true, }}
                                                />
                                                {error && (<p className="error-message">{error.message}</p>)}
                                            </>
                                        )}
                                    />
                                    <div className="address-button-wrapper">
                                        <button type="submit" className="address-submit-button">Kaydet</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

 
    return (
        <div className="payment-container max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Ödeme Sayfası</h1>

            {currentStep === 3 && orderNumber ? (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-green-600 mb-2">Siparişiniz Başarıyla Alındı!</h2>
        <p>Sipariş Numaranız: <strong>{orderNumber}</strong></p>
        <p className="mt-4">Ana sayfaya dönmek için <span onClick={() => navigate('/')} className="underline text-blue-500 cursor-pointer">tıklayın.</span></p>
    </div>
) : (
          
                <div className="payment-content-grid">
                
                    <div className="payment-left-column">
                        <div className="steps-indicator flex flex-col mb-6">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`step-item flex flex-col mb-4`}
                                >
                                    <div className="flex items-center">
                                        <span className={`step-number rounded-full flex items-center justify-center font-semibold mr-3
                                            flex-shrink-0
                                            ${index === currentStep
                                                ? "w-[32px] h-[32px] border-[10px] border-black bg-black text-white"
                                                : (index < currentStep
                                                    ? "w-[32px] h-[32px] border-[1px] border-black bg-white text-black"
                                                    : "w-[32px] h-[32px] border-[1px] border-black bg-white text-black"
                                                )}`}
                                        >
                                            {index + 1}
                                        </span>
                                        <p className={`font-semibold
                                            ${index <= currentStep
                                                ? 'text-[#272727] font-["Roboto"] text-[22px] font-semibold leading-[32px]'
                                                : 'text-gray-400'
                                            }`}>
                                            {step}
                                        </p>
                                    </div>

                                  
                                    {index === 0 && currentStep === 0 && (
                                        <div className="ml-10 mt-1 space-y-0.5">
                                            <h3 className="text-lg font-semibold mb-3">Teslimat Adresinizi Seçin</h3>
                                            {allAddresses && allAddresses.length > 0 ? (
                                                <div className="address-selection-grid">
                                                    {allAddresses.map((addr) => (
                                                        <div key={addr.id} className={`address-box ${selectedAddressId === addr.id.toString() ? 'selected-address-box' : ''}`}>
                                                            <div className="address-title-row flex items-center mb-2">
                                                                <label className="flex items-center cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="selectedAddress"
                                                                        value={addr.id}
                                                                        checked={selectedAddressId === addr.id.toString()}
                                                                        onChange={() => setSelectedAddressId(addr.id.toString())}
                                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                                    />
                                                                    <div className="address-title">{addr.title}</div>
                                                                </label>
                                                            </div>
                                                            <div className="address-details">
                                                                <div className="address-line">{`${addr.full_address}, ${addr.apartment_no || ''}`.trimEnd(', ')}</div>
                                                                <div className="address-location">
                                                                    {`${addr.region?.name || ''}, ${addr.country?.name || ''}`.trimEnd(', ')}
                                                                </div>
                                                                <div className="address-line">Tel: {addr.phone_number}</div>
                                                                <div className="address-line">Alıcı: {addr.first_name} {addr.last_name}</div>
                                                            </div>
                                                            <div className="address-actions">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setAddressToEdit(addr);
                                                                        reset({
                                                                            country_id: addr.country_id, 
                                                                            region_id: addr.region_id, 
                                                                            subregion_id: addr.subregion_id, 
                                                                            first_name: addr.first_name,
                                                                            last_name: addr.last_name,
                                                                            phone_number: addr.phone_number,
                                                                            full_address: addr.full_address,
                                                                            zip_code: addr.zip_code,
                                                                            title: addr.title,
                                                                            apartment_no: addr.apartment_no,
                                                                        });
                                                                        setselectedCountry(addr.country?.name || null);
                                                                        setselectedRegion(addr.region?.name || null);
                                                                        setselectedSubRegion(addr.subregion?.name || null);
                                                                        setIsEditAddressModalOpen(true);
                                                                    }}
                                                                    className="icon-button edit-button"
                                                                    title="Düzenle"
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        deleteMyAddress(addr.id.toString());
                                                                    }}
                                                                    className="icon-button delete-button"
                                                                    title="Sil"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                  
                                                    <div className="add-new-address-box">
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="selectedAddress"
                                                                value="new-address"
                                                                checked={selectedAddressId === "new-address"}
                                                                onChange={() => {
                                                                    setSelectedAddressId("new-address");
                                                                    setIsNewAddressModalOpen(true);
                                                                    reset();
                                                                    setselectedCountry(null);
                                                                    setselectedRegion(null);
                                                                    setselectedSubRegion(null);
                                                                }}
                                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                            />
                                                            <span className="add-new-address-text">Yeni Adres Ekle</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="ml-10 text-gray-700 text-sm mt-1 space-y-0.5">
                                                    <p className="text-red-500">Kayıtlı adresiniz bulunmamaktadır. Lütfen bir adres ekleyiniz.</p>
                                                    <button
                                                        onClick={() => {
                                                            setIsNewAddressModalOpen(true);
                                                            reset();
                                                            setselectedCountry(null);
                                                            setselectedRegion(null);
                                                            setselectedSubRegion(null);
                                                        }}
                                                        className="bg-blue-500 text-white text-xs py-1 px-2 rounded-md hover:bg-blue-700 transition"
                                                    >
                                                        Yeni Adres Ekle
                                                    </button>
                                                </div>
                                            )}
                                            <div className="mt-4 flex justify-end">
                                                <button onClick={goToNextStep} className="kg-button">
                                                    Kargo ile Devam Et
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                 
                                    {index === 1 && currentStep === 1 && (
                                        <div className="ml-10 mt-4 px-4 py-3 bg-white rounded-lg shadow-sm">
                                            <p className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Kargo Seçimi</p>
                                            <div className="space-y-4">
                                                {shippingMethods.map((shipping) => (
                                                    <label
                                                        key={shipping.value}
                                                        className={`
                                                            flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200
                                                            ${selectedShippingMethod?.value === shipping.value
                                                                ? "border-blue-600 bg-blue-50 shadow-md"
                                                                : "border-gray-300 hover:border-gray-400"
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="shipping"
                                                                value={shipping.value}
                                                                onChange={() => setSelectedShippingMethod(shipping)}
                                                                checked={selectedShippingMethod?.value === shipping.value}
                                                                className="form-radio h-5 w-5 text-blue-600 cursor-pointer focus:ring-blue-500"
                                                            />
                                                            <div className="ml-3">
                                                                <strong className="text-gray-800 text-base">{shipping.name}</strong>
                                                                <p className="text-gray-600 text-sm">{shipping.content}</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-semibold text-gray-900 text-base">
                                                            ₺{typeof shipping.price === 'number' ? shipping.price.toFixed(2) : 'Ücretsiz'}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="mt-6 flex justify-between items-center border-t pt-4">
                                                <button
                                                    onClick={goToPreviousStep}
                                                    className="
                                                        bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-lg
                                                        hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75
                                                        transition-all duration-200
                                                    "
                                                >
                                                    Geri
                                                </button>
                                                {selectedShippingMethod && (
                                                    <button onClick={goToNextStep} className="button-5">
                                                        Ödeme Adımına Git
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                  
                                    {index === 2 && currentStep === 2 && (
                                        <div className="ml-10 text-gray-700 text-sm mt-1 space-y-0.5">
                                            <h3 className="text-lg font-semibold mb-2">Ödeme Yöntemi Seçimi</h3>
                                            <div className="space-y-4">
                                                {paymentMethods.map((method) => (
                                                    <label key={method.type} className="flex items-center text-xs">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value={method.type}
                                                            onChange={handlePaymentMethodChange}
                                                            className="mr-2"
                                                            checked={paymentChoice === method.type}
                                                        />
                                                        <span>{method.name}</span>
                                                    </label>
                                                ))}
                                            </div>

                
                                            {paymentChoice === "credit_cart" && (
                                                <div className="mt-4">
                                                    <h3 className="text-md font-semibold mb-2">Kredi Kartı Bilgileri</h3>
                                                    <div className="space-y-2 mt-2">
                                                        <div>
                                                            <label htmlFor="card_name" className="block text-gray-700 text-xs font-bold mb-1">Kart Üzerindeki İsim*</label>
                                                            <input
                                                                type="text"
                                                                id="card_name"
                                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                                                                value={cardName}
                                                                onChange={(e) => setCardName(e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="card_digits" className="block text-gray-700 text-xs font-bold mb-1">Kart Numarası*</label>
                                                            <input
                                                                type="text"
                                                                id="card_digits"
                                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                                                                maxLength={16}
                                                                value={cardDigits}
                                                                onChange={handleCardDigitsChange}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div><label htmlFor="card_expiration_month" className="block text-gray-700 text-xs font-bold mb-1">SKT Ay*</label>
                                                                <select
                                                                    id="card_expiration_month"
                                                                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                                                                    value={cardExpirationMonth}
                                                                    onChange={(e) => setCardExpirationMonth(e.target.value)}
                                                                >
                                                                    <option value="">Ay Seçin</option>
                                                                    {months.map((month) => (
                                                                        <option key={month} value={month}>{month}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label htmlFor="card_expiration_year" className="block text-gray-700 text-xs font-bold mb-1">SKT Yıl*</label>
                                                                <select
                                                                    id="card_expiration_year"
                                                                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                                                                    value={cardExpirationYear}
                                                                    onChange={handleCardExpirationYearChange}
                                                                >
                                                                    <option value="">Yıl Seçin</option>
                                                                    {years.map((year) => (
                                                                        <option key={year} value={year}>{year}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="card_type" className="block text-gray-700 text-xs font-bold mb-1">Kart Tipi*</label>
                                                            <select
                                                                id="card_type"
                                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                                                                value={cardType}
                                                                onChange={(e) => setCardType(e.target.value)}
                                                            >
                                                                <option value="VISA">VISA</option>
                                                                <option value="Mastercard">Mastercard</option>
                                                                <option value="AMEX">AMEX</option>
                                                                <option value="Discover">Discover</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="card_security_code" className="block text-gray-700 text-xs font-bold mb-1">CVV</label>
                                                            <input
                                                                type="text"
                                                                id="card_security_code"
                                                                placeholder="CVV"
                                                                className="shadow appearance-none border rounded w-1/3 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                                                                maxLength={4}
                                                                value={cardSecurityCode}
                                                                onChange={(e) => setCardSecurityCode(e.target.value.replace(/\D/g, ''))}
                                                            />
                                                        </div>
                                                        <div className="mt-2 flex justify-between items-center">
                                                            <button onClick={goToPreviousStep} className="bg-gray-300 text-gray-700 text-xs py-1 px-2 rounded-md hover:bg-gray-400 transition">
                                                                Geri
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="button-5"
                                                                disabled={isSubmitting || formSubmitted}
                                                                onClick={handleCompletePayment}
                                                            >
                                                                {isSubmitting ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            
                                            {paymentChoice === "cash_at_door" && (
                                                <div className="mt-4">
                                                    <h3 className="text-md font-semibold mb-2">Kapıda Nakit Ödeme</h3>
                                                    <p className="text-gray-700 text-xs">Ödemenizi teslimat sırasında nakit olarak yapabilirsiniz. (Ek ücret: {CASH_ON_DELIVERY_FEE} TL)</p>
                                                    <div className="mt-2 flex justify-between items-center">
                                                        <button onClick={goToPreviousStep} className="bg-gray-300 text-gray-700 text-xs py-1 px-2 rounded-md hover:bg-gray-400 transition">
                                                            Geri
                                                        </button>
                                                        <button onClick={handleCompletePayment} className="button-5" disabled={isSubmitting}>
                                                            {isSubmitting ? 'İşleniyor...' : 'Siparişi Tamamla'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                           
                                            {paymentChoice === "credit_cart_at_door" && (
                                                <div className="mt-4">
                                                    <h3 className="text-md font-semibold mb-2">Kapıda Kredi Kartı Ödeme</h3>
                                                    <p className="text-gray-700 text-xs">Ödemenizi teslimat sırasında kredi/banka kartıyla yapabilirsiniz. (Ek ücret: {CARD_ON_DELIVERY_FEE} TL)</p>
                                                    <div className="mt-2 flex justify-between items-center">
                                                        <button onClick={goToPreviousStep} className="bg-gray-300 text-gray-700 text-xs py-1 px-2 rounded-md hover:bg-gray-400 transition">
                                                            Geri
                                                        </button>
                                                        <button onClick={handleCompletePayment} className="button-5" disabled={isSubmitting}>
                                                            {isSubmitting ? 'İşleniyor...' : 'Siparişi Tamamla'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="payment-right-column w-[600px] flex-shrink-0">
                        <div className="bg-white p-4 rounded-lg shadow-md h-[200px] flex flex-col justify-between">
                            <h3 className="text-lg font-semibold mb-3">Sipariş Özeti</h3>
                            <div className="flex-grow overflow-y-auto pr-2">
                                {bears.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center mb-2">
                                        <div className="flex ">
                                            <img
                                                src={item.image || `https://placehold.co/64x64/E0E0E0/000000?text=Ürün`}
                                                alt={item.name}
                                                className="w-[64px] h-[64px] flex-shrink-0 object-cover rounded-md mr-4"
                                                onError={(e) => { e.currentTarget.src = `https://placehold.co/64x64/E0E0E0/000000?text=Ürün`; }}
                                            />
                                            <div>
                                                <span className="text-[#272727] font-['Roboto'] text-sm font-semibold leading-tight">
                                                    {item.name}
                                                </span>
                                               <p className="kg-8">
  {Math.round(safeParseFloat(item.size?.pieces))} KG
</p>
                                            </div>
                                        </div>
                                        <span className="text-[#272727] font-['Roboto'] text-base font-semibold">₺{(safeParseFloat(item.price) * safeParseFloat(item.count)).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <hr className="w-full h-[1px] bg-[#E5E4E9] my-2" />
                            <div className="flex justify-between font-bold text-lg text-[#272727] font-['Roboto'] text-xl leading-tight">
                                <span>Genel Toplam:</span>
                                <span>₺{(totalPrice + (selectedShippingMethod?.price || 0) + extra).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

           
            {isNewAddressModalOpen && (
                <div className="modal-container" onClick={(e) => {
                    if (e.target.className === 'modal-container') {
                        setIsNewAddressModalOpen(false);
                    }
                }}>
                    <div className="modal-wrapper">
                        <div className="modal-title-wrapper">
                            <h5 className="modal-title">Yeni Adres Ekle</h5>
                            <button className="modal-close-button" onClick={() => setIsNewAddressModalOpen(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-form-wrapper">
                            <form onSubmit={handleSubmit(addressSubmit)} className="modal-form">
                                <label className="address-title-label">*Adres Başlığı</label>
                                <input {...register("title", { required: "Adres başlığı zorunludur." })} id="payment-modal-address-title-input" type="text" placeholder="ev,iş vb..." className="address-title-input" />
                                {errors.title && <p className="error-message">{errors.title.message}</p>}

                                <label className="address-firstName-label">*Ad</label>
                                <input {...register("first_name", { required: "Adınız zorunludur." })} id="payment-modal-address-firstName-input" type="text" className="address-firstName-input" />
                                {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}

                                <label className="address-lastName-label">*Soyad</label>
                                <input {...register("last_name", { required: "Soyadınız zorunludur." })} id="payment-modal-address-lastName-input" type="text" className="address-lastName-input" />
                                {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}

                                <label className="address-label">*Adres</label>
                                <input {...register("full_address", { required: "Adres bilgisi zorunludur." })} id="payment-modal-address-input" type="text" className="address-input" />
                                {errors.full_address && <p className="error-message">{errors.full_address.message}</p>}

                                <label className="address-city-label">*Ülke</label>
                                <select
                                    {...register("country_id", { required: "Lütfen bir ülke seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                    id="payment-modal-address-country-input"
                                    onChange={(e) => {
                                        const selectedCountryObj = countries?.data?.results?.find((country) => country.id === Number(e.target.value));
                                        setselectedCountry(selectedCountryObj ? selectedCountryObj.name : null);
                                        setselectedRegion(null);
                                        setselectedSubRegion(null);
                                    }}
                                    defaultValue=""
                                    className="address-city-input"
                                >
                                    <option value="" disabled>Ülke Seçin</option>
                                    {countries?.data?.results?.map((country) => (
                                        <option key={country.id} value={country.id}>{country.name}</option>
                                    ))}
                                </select>
                                {countriesLoading && <div>Ülkeler yükleniyor...</div>}
                                {countriesError && <div className="error-message">{countriesError}</div>}
                                {errors.country_id && <p className="error-message">{errors.country_id.message}</p>}

                                <label className="address-state-label">*Şehir</label>
                                <select
                                    {...register("region_id", { required: "Lütfen bir şehir seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                    id="payment-modal-address-state-input"
                                    onChange={(e) => {
                                        const selectedRegionObj = region?.data?.results?.find((regionItem) => regionItem.id === Number(e.target.value));
                                        setselectedRegion(selectedRegionObj ? selectedRegionObj.name : null);
                                        setselectedSubRegion(null);
                                    }}
                                    defaultValue=""
                                    className="address-state-input"
                                    disabled={!selectedCountry || regionLoading || regionError || !region?.data?.results}
                                >
                                    <option value="" disabled>Şehir Seçin</option>
                                    {region?.data?.results?.map((regionItem) => (
                                        <option key={regionItem.id} value={regionItem.id}>{regionItem.name}</option>
                                    ))}
                                </select>
                                {regionLoading && <div>Şehirler yükleniyor...</div>}
                                {regionError && <div className="error-message">{regionError}</div>}
                                {!selectedCountry && <div className="info-message">Önce ülke seçin.</div>}
                                {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                {errors.region_id && <p className="error-message">{errors.region_id.message}</p>}

                                <label className="address-subregion-label">*İlçe</label>
                                <select
                                    {...register("subregion_id", { required: "Lütfen bir ilçe seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                    id="payment-modal-address-subregion-input"
                                    onChange={(e) => {
                                        const selectedSubregionObj = subRegion?.data?.results?.find((subregionItem) => subregionItem.id === Number(e.target.value));
                                        setselectedSubRegion(selectedSubregionObj ? selectedSubregionObj.name : null);
                                    }}
                                    defaultValue=""
                                    className="address-subregion-input"
                                    disabled={!selectedRegion || subRegionLoading || subRegionError || !subRegion?.data?.results}
                                >
                                    <option value="" disabled>İlçe Seçin</option>
                                    {subRegion?.data?.results?.map((subRegionItem) => (
                                        <option key={subRegionItem.id} value={subRegionItem.id}>{subRegionItem.name}</option>
                                    ))}
                                </select>
                                {subRegionLoading && <div>İlçeler yükleniyor...</div>}
                                {subRegionError && <div className="error-message">{subRegionError}</div>}
                                {!selectedRegion && <div className="info-message">Önce şehir seçin.</div>}
                                {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                {errors.subregion_id && <p className="error-message">{errors.subregion_id.message}</p>}

                                <label className="address-phone-label">*Telefon</label>
                                <Controller
                                    name="phone_number"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Telefon numarası zorunludur.", }}
                                    render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                        <>
                                            <PhoneInput
                                                inputStyle={{ width: '100%', padding: '12px 15px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#F7F7F7', fontSize: '16px', color: '#222', boxSizing: 'border-box', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', height: '50px', paddingLeft: '45px', }}
                                                containerClass="address-phone-container"
                                                inputClass="address-phone-input"
                                                country={"tr"}
                                                value={value}
                                                onChange={(phone) => onChange(`+${phone}`)}
                                                inputProps={{ name: "phone_number", required: true, autoFocus: true, }}
                                            />
                                            {error && (<p className="error-message">{error.message}</p>)}
                                        </>
                                    )}
                                />
                                <div className="address-button-wrapper">
                                    <button type="submit" className="address-submit-button">Kaydet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

           
            {isEditAddressModalOpen && addressToEdit && (
                <div className="modal-container" onClick={(e) => {
                    if (e.target.className === 'modal-container') {
                        setIsEditAddressModalOpen(false);
                    }
                }}>
                    <div className="modal-wrapper">
                        <div className="modal-title-wrapper">
                            <h5 className="modal-title">Adresi Düzenle</h5>
                            <button className="modal-close-button" onClick={() => setIsEditAddressModalOpen(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-form-wrapper">
                            <form onSubmit={handleSubmit(editMyAddress)} className="modal-form">
                                <label className="address-title-label">*Adres Başlığı</label>
                                <input {...register("title", { required: "Adres başlığı zorunludur." })} id="payment-edit-address-title-input" type="text" placeholder="ev,iş vb..." className="address-title-input" />
                                {errors.title && <p className="error-message">{errors.title.message}</p>}

                                <label className="address-firstName-label">*Ad</label>
                                <input {...register("first_name", { required: "Adınız zorunludur." })} id="payment-edit-address-firstName-input" type="text" className="address-firstName-input" />
                                {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}

                                <label className="address-lastName-label">*Soyad</label>
                                <input {...register("last_name", { required: "Soyadınız zorunludur." })} id="payment-edit-address-lastName-input" type="text" className="address-lastName-input" />
                                {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}

                                <label className="address-label">*Adres</label>
                                <input {...register("full_address", { required: "Adres bilgisi zorunludur." })} id="payment-edit-address-input" type="text" className="address-input" />
                                {errors.full_address && <p className="error-message">{errors.full_address.message}</p>}

                                <label className="address-city-label">*Ülke</label>
                                <select
                                    {...register("country_id", { required: "Lütfen bir ülke seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                    id="payment-edit-address-country-input"
                                    onChange={(e) => {
                                        const selectedCountryObj = countries?.data?.results?.find((country) => country.id === Number(e.target.value));
                                        setselectedCountry(selectedCountryObj ? selectedCountryObj.name : null);
                                        setselectedRegion(null);
                                        setselectedSubRegion(null);
                                    }}
                                    defaultValue={addressToEdit.country_id}
                                    className="address-city-input"
                                >
                                    <option value="" disabled>Ülke Seçin</option>
                                    {countries?.data?.results?.map((country) => (
                                        <option key={country.id} value={country.id}>{country.name}</option>
                                    ))}
                                </select>
                                {countriesLoading && <div>Ülkeler yükleniyor...</div>}
                                {countriesError && <div className="error-message">{countriesError}</div>}
                                {errors.country_id && <p className="error-message">{errors.country_id.message}</p>}

                                <label className="address-state-label">*Şehir</label>
                                <select
                                    {...register("region_id", { required: "Lütfen bir şehir seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                    id="payment-edit-address-state-input"
                                    onChange={(e) => {
                                        const selectedRegionObj = region?.data?.results?.find((regionItem) => regionItem.id === Number(e.target.value));
                                        setselectedRegion(selectedRegionObj ? selectedRegionObj.name : null);
                                        setselectedSubRegion(null);
                                    }}
                                    defaultValue={addressToEdit.region_id}
                                    className="address-state-input"
                                    disabled={!selectedCountry || regionLoading || regionError || !region?.data?.results}
                                >
                                    <option value="" disabled>Şehir Seçin</option>
                                    {region?.data?.results?.map((regionItem) => (
                                        <option key={regionItem.id} value={regionItem.id}>{regionItem.name}</option>
                                    ))}
                                </select>
                                {regionLoading && <div>Şehirler yükleniyor...</div>}
                                {regionError && <div className="error-message">{regionError}</div>}
                                {!selectedCountry && <div className="info-message">Önce ülke seçin.</div>}
                                {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                {errors.region_id && <p className="error-message">{errors.region_id.message}</p>}

                                <label className="address-subregion-label">*İlçe</label>
                                <select
                                    {...register("subregion_id", { required: "Lütfen bir ilçe seçin.", setValueAs: (value) => parseInt(value, 10), })}
                                    id="payment-edit-address-subregion-input"
                                    onChange={(e) => {
                                        const selectedSubregionObj = subRegion?.data?.results?.find((subregionItem) => subregionItem.id === Number(e.target.value));
                                        setselectedSubRegion(selectedSubregionObj ? selectedSubregionObj.name : null);
                                    }}
                                    defaultValue={addressToEdit.subregion_id}
                                    className="address-subregion-input"
                                    disabled={!selectedRegion || subRegionLoading || subRegionError || !subRegion?.data?.results}
                                >
                                    <option value="" disabled>İlçe Seçin</option>
                                    {subRegion?.data?.results?.map((subRegionItem) => (
                                        <option key={subRegionItem.id} value={subRegionItem.id}>{subRegionItem.name}</option>
                                    ))}
                                </select>
                                {subRegionLoading && <div>İlçeler yükleniyor...</div>}
                                {subRegionError && <div className="error-message">{subRegionError}</div>}
                                {!selectedRegion && <div className="info-message">Önce şehir seçin.</div>}
                                {selectedCountry && region?.data?.results?.length === 0 && !regionLoading && !regionError && <div className="info-message">Bu ülkede şehir bulunmuyor.</div>}
                                {errors.subregion_id && <p className="error-message">{errors.subregion_id.message}</p>}

                                <label className="address-phone-label">*Telefon</label>
                                <Controller
                                    name="phone_number"
                                    control={control}
                                    defaultValue={addressToEdit.phone_number}
                                    rules={{ required: "Telefon numarası zorunludur.", }}
                                    render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                        <>
                                            <PhoneInput
                                                inputStyle={{ width: '100%', padding: '12px 15px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#F7F7F7', fontSize: '16px', color: '#222', boxSizing: 'border-box', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', height: '50px', paddingLeft: '45px', }}
                                                containerClass="address-phone-container"
                                                inputClass="address-phone-input"
                                                country={"tr"}
                                                value={value}
                                                onChange={(phone) => onChange(`+${phone}`)}
                                                inputProps={{ name: "phone_number", required: true, autoFocus: true, }}
                                            />
                                            {error && (<p className="error-message">{error.message}</p>)}
                                        </>
                                    )}
                                />
                                <div className="address-button-wrapper">
                                    <button type="submit" className="address-submit-button">Kaydet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;