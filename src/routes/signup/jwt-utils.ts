export function isTokenExpired(token: string): boolean {
  if (!token) {
      return true;
  }
  try {
      const Payload = decodeToken(token);
      const expDate = new Date(Payload.exp * 1000);
      const currentDate = new Date();
      return expDate < currentDate;
  } catch (error) {
      console.error("Token çözümlenirken hata:", error);
      return true; 
  }
}

export function decodeToken(token: string) {
  if (!token) {
      throw new Error("Token yok.");
  }
  const base64Url = token.split('.')[1];
  if (!base64Url) {
      throw new Error("Geçersiz token formatı.");
  }
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  try {
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
  } catch (error) {
      console.error("Base64 çözme veya JSON parse hatası:", error);
      throw new Error("Geçersiz token içeriği.");
  }
}