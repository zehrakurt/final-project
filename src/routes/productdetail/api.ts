
import axios from 'axios';

const BASE_URL = 'https://fe1111.projects.academy.onlyjs.com/api/v1';

export const getProductComments = async (productSlug: string, offset: number = 0) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/products/${productSlug}/comments?limit=10&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    console.error('Yorumları çekerken hata oluştu:', error);
    throw error;
  }
};