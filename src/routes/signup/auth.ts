import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  setTokens,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  removeTokens,
  getAccessToken,
} from "./storage";
import { isTokenExpired } from "./jwt-utils";

import { FetchWithAuth } from "./api-client";
const BASE_URL = "https://fe1111.projects.academy.onlyjs.com/api/v1";


async function handleResponse<T>(response: AxiosResponse<T>): Promise<T> {
  if (response.status < 200 || response.status >= 300) {
    const errorData = response.data as any;
    let errorMessage = 'API isteği başarısız oldu';
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.reason) {
      errorMessage = JSON.stringify(errorData.reason);
    } else if (typeof response.data === 'string') {
      errorMessage = response.data;
    } else {
      errorMessage += ` (Durum kodu: ${response.status})`;
    }
    console.error("API Hatası:", errorMessage, errorData);
    throw new Error(errorMessage);
  }
  return response.data;
}

let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; config: AxiosRequestConfig }[] = [];


const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


export const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, config: {} as AxiosRequestConfig });
    });
  }

  isRefreshing = true;
  const refreshToken = getRefreshToken();
  if (!refreshToken || isTokenExpired(refreshToken)) {
    removeTokens();
    window.location.href = '/login';
    return null;
  }
  try {
    const response = await axios.post<{ access_token: string; refresh_token?: string }>(
      `${BASE_URL}/auth/token/refresh`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const { access_token, refresh_token } = response.data;
    setAccessToken(access_token);
    if (refresh_token) {
      setRefreshToken(refresh_token);
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    processQueue(null, access_token);
    return access_token;
  } catch (error: any) {
    let errorMessage = 'Token yenileme hatası: Bilinmeyen bir hata oluştu';
    if (error?.response?.data?.message) {
      errorMessage = `Token yenileme hatası: ${error.response.data.message}`;
    } else if (error?.message) {
      errorMessage = `Token yenileme hatası: ${error.message}`;
    }
    console.error(errorMessage, error?.response?.data || error);
    removeTokens();
    window.location.href = '/login';
    processQueue(error, null);
    return null;
  } finally {
    isRefreshing = false;
  }
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: any) => {
    const token = getAccessToken();
    if (token && !config.headers?.['Authorization']) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken !== null) {
          originalRequest.headers = {
            ...originalRequest.headers,
            'Authorization': `Bearer ${newAccessToken}`,
          }
          const res = await api(originalRequest);
          processQueue(null, newAccessToken);
          return res;

        } else {
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    else if (error.response) {
      console.error(`API error ${error.response.status} from ${originalRequest.url}:`, error.response.data);
    } else {
      console.error("API request failed:", error.message);
    }
    return Promise.reject(error);
  },
);


export const getMyProfile = async (): Promise<any> => {
  try {
    const response = await api.get("/users/my-account");
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Profil bilgisi alınamadı: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Profil bilgisi alınamadı: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const CreateNewAddress = async (data: any): Promise<any> => {
  try {
    const response = await api.post("/users/addresses", data);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Adres oluşturulamadı: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Adres oluşturulamadı: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const GetAllMyAddress = async (): Promise<any> => {
  console.log("GetAllMyAddress çağrıldı");
  try {
    const response = await api.get("/users/addresses?limit=10&offset=0");
    console.log("GetAllMyAddress yanıtı:", response);
    return handleResponse(response);
  } catch (error: any) {
    console.error("GetAllMyAddress hatası:", error);
    throw error;
  }
};



export const DeleteMyAddress = async (addressId: string): Promise<any> => {
  try {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Adres silinemedi: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Adres silinemedi: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const EditMyAddress = async (data: { addressId: string, data: any }): Promise<any> => {
  try {
    const response = await api.put(`/users/addresses/${data.addressId}`, data.data);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Adres düzenlenemedi: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Adres düzenlenemedi: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const GetCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/world/countries?limit=300`);
    return response.data?.data?.results || [];
  } catch (error: any) {
    let errorMessage = "Ülkeler yüklenirken hata: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Ülkeler yüklenirken hata: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    return [];
  }
};


export const GetRegionsByCountry = async (countryName: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/world/region?limit=1000&country-name=${countryName}`);
    return response.data?.data?.results || [];
  } catch (error: any) {
    let errorMessage = "Şehirler yüklenirken hata: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Şehirler yüklenirken hata: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    return [];
  }
};

export const GetSubRegionsByRegion = async (regionName: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/world/subregion?limit=1000&region-name=${regionName}`);
    return response.data?.data?.results || [];
  } catch (error: any) {
    let errorMessage = "İlçeler yüklenirken hata: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "İlçeler yüklenirken hata: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    return [];
  }
};


export const getCart = async (): Promise<any> => {
  try {
    const response = await api.get("/users/cart");
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Sepet bilgisi alınamadı: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Sepet bilgisi alınamadı: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const AddBasketToProduct = async (data: { product_id: number; product_variant_id?: string; pieces: number }) => {
  try {
    const response = await api.post("/users/cart", data);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Sepete ürün eklenirken hata oluştu: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Sepete ürün eklenirken hata oluştu: " + error.response.data.message;
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const deleteFromCart = async (payload: { product_id: number; product_variant_id: string; pieces: number }) => {
  try {
    const response = await api.delete("/users/cart", { data: payload }); // Body ile DELETE isteği
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Sepetten ürün silinirken hata oluştu: Bilinmeyen bir hata';
    if (error.response?.data?.message) {
      errorMessage = 'Sepetten ürün silinirken hata oluştu:' + error.response.data.message;
    }
    console.error(errorMessage, error.response?.data || error.message);
    throw error;
  }
};


export const login = async (username: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { username, password, api_key: import.meta.env.VITE_API_KEY });
    setTokens(response.data.access_token, response.data.refresh_token);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Giriş hatası: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Giriş hatası: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};

export const register = async (userData: any): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Kayıt hatası: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Kayıt hatası: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};

export const GetMyAllOrder = async (): Promise<any> => {
  try {
    const response = await api.get("/orders");
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Siparişler getirilemedi: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Siparişler getirilemedi: " + error.response.data.message;
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const GetMyOrderDetails = async (order_id: string): Promise<any> => {
  try {
    const response = await api.get(`/orders/${order_id}`);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = `Sipariş detayları (${order_id}) getirilemedi: Bilinmeyen bir hata oluştu`;
    if (error?.response?.data?.message) {
      errorMessage = `Sipariş detayları (${order_id}) getirilemedi: ` + error.response.data.message;
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const GetMyCreditCards = async (): Promise<any> => {
  try {
    const response = await api.get("/users/credit-cards");
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Kredi kartları getirilemedi: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Kredi kartları getirilemedi: " + error.response.data.message;
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const AddMyCreditCard = async (data: any): Promise<any> => {
  try {
    const response = await api.post("/users/credit-cards", data);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Kredi kartı eklenemedi: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Kredi kartı eklenemedi: " + error.response.data.message;
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};


export const DeleteMyCreditCard = async (cardId: string): Promise<any> => {
  try {
    const response = await api.delete(`/users/credit-cards/${cardId}`);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Kredi kartı silinemedi: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Kredi kartı silinemedi: " + error.response.data.message;
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};

export const GetPaymentMethods = async (): Promise<any> => {
  console.log("GetPaymentMethods çağrıldı");
  try {
    const response = await api.get("/orders/payment-settings");
    console.log("GetPaymentMethods yanıtı:", response);
    return handleResponse(response);
  } catch (error: any) {
    console.error("GetPaymentMethods hatası:", error);
    throw error;
  }
};


export const CalculateShipmentFee = async (): Promise<any> => {
  console.log("CalculateShipmentFee çağrıldı");
  try {
    const response = await api.get("/orders/calculate-shipment-fee");
    console.log("CalculateShipmentFee yanıtı:", response);
    return handleResponse(response);
  } catch (error: any) {
    console.error("CalculateShipmentFee hatası:", error);
    throw error;
  }
};


export interface OrderToProductsPayload {
  address_id: string | null;
  payment_type: 'credit_cart' | 'credit_cart_at_door' | 'cash_at_door';
  card_digits?: string;
  card_expiration_date?: string;
  card_security_code?: string;
  card_type?: string;

}

export async function OrderToProducts(data: OrderToProductsPayload): Promise<any> {
  console.log('Gönderilen Sipariş Verisi:', data);
  try {

    const response = await api.post("/orders/complete-shopping", data);
    return handleResponse(response);
  } catch (error) {
    console.error("OrderToProducts hatası:", error);
    throw error;
  }
}
interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
}

export async function UpdateMyProfile(data: UserProfile): Promise<UsersType['data']> {
  try {
    const response = await FetchWithAuth<UsersType>("/users/my-account", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response) {
      throw new Error("Profil güncellenirken bir hata oluştu.");
    }

    if (typeof response.status !== 'undefined' && !response.status.startsWith('2')) {
      let errorMessage = `Profil güncellenirken bir hata oluştu. HTTP Durum Kodu: ${response.status}`;
      try {
        const errorData = await (response as any).json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData && errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch (jsonError) {
        console.error("Hata yanıtı JSON olarak ayrıştırılamadı:", jsonError);
        try {
          const errorText = await (response as any).text();
          errorMessage = errorText;
        } catch (textError) {
          console.error("Hata yanıtısı metin olarak da alınamadı:", textError);
        }
      }
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error: any) {
    console.error("UpdateMyProfile hatası:", error);
    throw error;
  }
}

export interface UsersType {
  status: string;
  data?: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  message?: string;
  error?: string;
}


export const getCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/world/countries?limit=300`);
    return response.data?.data?.results || [];
  } catch (error: any) {
    let errorMessage = "Ülkeler yüklenirken hata: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Ülkeler yüklenirken hata: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    return [];
  }
};

export const getCitiesByCountryId = async (countryId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/world/region?country-id=${countryId}&limit=1000`);
    return response.data?.data?.results || [];
  } catch (error: any) {
    let errorMessage = "Şehirler alınırken hata: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Şehirler alınırken hata: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    return [];
  }
};


export const getDistrictsByCityId = async (regionId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/world/subregion?region-id=${regionId}&limit=1000`);
    return response.data?.data?.results || [];
  } catch (error: any) {
    let errorMessage = "İlçeler alınırken hata: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "İlçeler alınırken hata: " + error.response.data.message
    }
    console.error(errorMessage, error?.response?.data || error);
    return [];
  }
};

export const postProductComment = async (productSlug: string, payload: { stars: number; title: string; comment: string }) => {
  try {
    const response = await api.post(`/products/${productSlug}/comments`, payload);
    return handleResponse(response);
  } catch (error: any) {
    let errorMessage = "Yorum gönderilirken hata oluştu: Bilinmeyen bir hata oluştu";
    if (error?.response?.data?.message) {
      errorMessage = "Yorum gönderilirken hata oluştu: " + error.response.data.message;
    }
    console.error(errorMessage, error?.response?.data || error);
    throw error;
  }
};