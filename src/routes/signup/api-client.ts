import { getAccessToken, removeTokens } from "./storage";
import { refreshAccessToken } from "./auth";
import { isTokenExpired } from "./jwt-utils";

export const BASE_URL = "https://fe1111.projects.academy.onlyjs.com/api/v1";

function redirectToLogin() {
  removeTokens();
  if (!window.location.href.includes("/login")) {
    window.location.href = "/login";
  }
}


async function parseErrorMessage(response: Response, defaultMessage: string): Promise<string> {
  try {
    const errorJson = await response.json();
    if (errorJson && (errorJson.message || errorJson.error || errorJson.reason)) {
      return errorJson.message || errorJson.error || errorJson.reason;
    }
  } catch (jsonError) {
    try {
      const errorText = await response.text();
      if (errorText) {
        return errorText;
      }
    } catch (textError) {
      return defaultMessage;
    }
  }
  return defaultMessage;
}

export async function FetchWithAuth<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    let accessToken = getAccessToken();

    if (!accessToken || isTokenExpired(accessToken)) {
      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        redirectToLogin();
        throw new Error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
      }
      accessToken = newAccessToken;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const urlWithSlash = url.startsWith("/") ? url : "/" + url;
    const response = await fetch(BASE_URL + urlWithSlash, {
      ...options,
      headers,
    });


    if (!response.ok) {
      const errorMessage = await parseErrorMessage(response, `API isteği başarısız. Kod: ${response.status}`);
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType && contentType.includes("application/json")) {

      if (typeof response.json === 'function') {
        data = await response.json();
      } else {
        console.error("Hata: response.json bir fonksiyon değil!", response);
        throw new Error("Beklenen JSON yanıtı alınamadı.");
      }
    } else {

      if (typeof response.text === 'function') {
        data = await response.text();
        console.warn("API yanıtı JSON değil. Dönen değer:", data);
      } else {
        console.error("Hata: response.text bir fonksiyon değil!", response);
        throw new Error("Beklenen metin yanıtı alınamadı.");
      }
    }
    return data as T;
  } catch (error: any) {
    console.error("API hatası:", error);
    throw error;
  }
}


export const postWithAuth = <T>(url: string, body: any) =>
  FetchWithAuth<T>(url, { method: 'POST', body: JSON.stringify(body) });

export const getWithAuth = <T>(url: string) => FetchWithAuth<T>(url, { method: 'GET' });

export const putWithAuth = <T>(url: string, body: any) =>
  FetchWithAuth<T>(url, { method: 'PUT', body: JSON.stringify(body) });

export const deleteWithAuth = <T>(url: string, body?: any) => {
  const options: RequestInit = { method: 'DELETE' };
  if (body) {
    options.body = JSON.stringify(body);
    options.headers = { 'Content-Type': 'application/json' };
  }
  return FetchWithAuth<T>(url, options);
};



export const addToCart = async (payload: any) => {
  return await postWithAuth<{ status: string; data: {} }>('/users/cart', payload);
};

export const getBasketData = async () => {
  return await getWithAuth<any>('/users/cart');
};


export const getBasket = async () => {
  try {
    const response = await getWithAuth("/baskets/");
    return response;
  } catch (error) {
    console.error("Sepet verisi alınamadı:", error);
    throw error;
  }
};

export const getUserAddresses = async (userId: number | undefined) => {
  if (!userId) return { data: { results: [] } };
  try {
    const response = await getWithAuth(`/users/${userId}/addresses/`);
    return response;
  } catch (error) {
    console.error("Kullanıcı adresleri alınamadı:", error);
    throw error;
  }
};

export const getSubRegionsByRegionId = async (regionId: number | null) => {
  if (!regionId) return { data: { results: [] } };
  try {
    const response = await getWithAuth(`/world/subregion?region-id=${regionId}`);
    return response;
  } catch (error) {
    console.error("Alt bölgeler alınamadı:", error);
    throw error;
  }
};

export const getCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/world/countries?limit=300`);
    const data = await response.json();
    return data?.data?.results || [];
  } catch (error) {
    console.error("Ülkeler alınamadı:", error);
    throw error;
  }
};


export const getCitiesByCountryId = async (countryId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/world/region?country-id=${countryId}&limit=1000`);
    const data = await response.json();
    return data?.data?.results || [];
  } catch (error) {
    console.error("Şehirler alınamadı:", error);
    throw error;
  }
};


export const getDistrictsByCityId = async (regionId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/world/subregion?region-id=${regionId}&limit=1000`);
    const data = await response.json();
    return data?.data?.results || [];
  } catch (error) {
    console.error("İlçeler alınamadı:", error);
    throw error;
  }
};
