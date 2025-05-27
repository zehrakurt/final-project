const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const setAccessToken = (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeAccessToken = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const removeRefreshToken = (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
};

export const removeTokens = (): void => {
    removeAccessToken();
    removeRefreshToken();
};