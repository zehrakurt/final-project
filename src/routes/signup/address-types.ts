export interface CountryType {
  id: number;
  name: string;
}

export interface RegionType {
  id: number;
  name: string;
  country: CountryType;
}

export interface SubRegionType {
  id: number;
  name: string;
  region: {
      id: number;
      name: string;
      country: CountryType;
  };
}

export interface AddressType {
  id?: string;
  title: string;
  first_name: string;
  last_name: string;
  full_address: string;
  country?: CountryType;
  country_id?: number;
  region?: RegionType;
  region_id?: number;
  subregion?: SubRegionType;
  subregion_id?: number;
  phone_number: string;
}

export interface CountriesType {
  status: string;
  data: {
      count: number;
      next: null | string;
      previous: null | string;
      results: {
          id: number;
          name: string;
      }[];
  };
}

export interface RegionResponseType {
  status: string;
  data: {
      count: number;
      next: null | string;
      previous: null | string;
      results: {
          id: number;
          name: string;
          country: CountryType;
      }[];
  };
}

export interface SubRegionResponseType {
  status: string;
  data: {
      count: number;
      next: null | string;
      previous: null | string;
      results: {
          id: number;
          name: string;
          region: {
              id: number;
              name: string;
              country: CountryType;
          };
      }[];
  };
}

export interface CreateAddressResultType {
  status: string;
  data: {
      id: string;
      title: string;
      country: CountryType;
      region: {
          id: number;
          name: string;
          country: CountryType;
      };
      full_address: string;
      phone_number: string;
      subregion: {
          id: number;
          name: string;
          region: {
              id: number;
              name: string;
              country: CountryType;
          };
      };
      first_name: string;
      last_name: string;
  };
}

export interface AddressFromBackend {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  full_address: string;
  country: CountryType;
  region: {
      id: number;
      name: string;
      country: CountryType;
  };
  subregion: {
      id: number;
      name: string;
      region: {
          id: number;
          name: string;
          country: CountryType;
      };
  };
  phone_number: string;
}

export interface AllAddressType {
  status: string;
  data: {
      count: number;
      next: string | null;
      previous: string | null;
      results: AddressFromBackend[];
  };
}

export interface AddressPayloadType {
  title: string;
  first_name: string;
  last_name: string;
  full_address: string;
  country_id: number;
  region_id: number;
  subregion_id: number;
  phone_number: string;
}

export interface PaymentMethodPayload {
  card_digits: string;
    card_expiration_date: string;
    card_security_code: string;
}

export interface OrderItemPayload {
  product_variant_id: number; // Backend'in beklediği ürün ID tipi (number olduğunu varsayıyoruz)
  quantity: number;
}

export interface OrderToProductsPayload {
  address_id:string | undefined,
  payment_type:string | undefined,
  card_digits:string,
  card_expiration_date: string,
  card_security_code:string,
  card_type:string | undefined,
}
export interface ShippingMethod {
  name: string;
  value: string;
  price?: number;
}
export interface AllOrderTypes {
  status: string;
  data: {
      order_no: string;
      order_status: string;
      created_at: string;
      total_price: number;
      cart_detail: {
          variant_id: string;
          name: string;
          photo_src: string;
          pieces: string;
          unit_price: string;
          total_price: string;
          slug: string;
      }[];
  }[];
}

export interface OrderDetailsType {
  status: string;
  data: {
      order_no: string;
      order_status: string;
      shipment_tracking_number: string;
      address: {
          title: string;
          country: string;
          region: string;
          subregion: string;
          full_address: string;
          phone_number: string;
      };
      payment_detail: {
          card_digits: string;
          card_expiration_date: string;
          card_security_code: string;
          payment_type: string;
          card_type: string;
          base_price: number;
          shipment_fee: number;
          payment_fee: number;
          discount_ratio: number;
          discount_amount: number;
          final_price: number;
      };
      shopping_cart: {
          total_price: number;
          items: {
              product_id: string;
              product_slug: string;
              product_variant_id: string;
              product: string;
              product_variant_detail: {
                  size: {
                      gram: number;
                      pieces: number;
                      total_services: number;
                  };
                  aroma: string;
                  photo_src: string;
              };
              pieces: number;
              unit_price: number;
              total_price: number;
          }[];
      };
  };
}
export interface ProductDetailType {
  status: string;
  data: {
      id: string;
      name: string;
      slug: string;
      short_explanation: string;
      explanation: {
          usage: string;
          features: string;
          description: string;
          nutritional_content: {
              ingredients: {
                  aroma: string;
                  value: string;
              }[];
              nutrition_facts: {
                  ingredients: {
                      name: string;
                      amounts: string[];
                  }[];
                  portion_sizes: string[];
              };
              amino_acid_facts: {
                  ingredients: {
                      name: string;
                      amounts: string[];
                  }[];
                  portion_sizes: string[];
              };
          };
      };
      main_category_id: string;
      sub_category_id: string;
      tags: string[];
      variants: VariantsType[];
      comment_count: number;
      average_star: number | string;
  };
}

export interface VariantsType {
  id: string;
  name?: string;
  count?: number;
  size: {
      gram: number;
      pieces: number;
      total_services: number;
  };
  aroma: string;
  price: {
      profit: null | number;
      total_price: number;
      discounted_price: null | number;
      price_per_servings: number;
      discount_percentage: null | number;
  };
  photo_src: string;
  is_available: boolean;
}

export interface SizeType {
  gram: number;
  pieces: number;
  total_services: number;
}

export interface BasketProductsPayload {
  product_id: string;
  product_variant_id: string;
  pieces: number;
}

export interface BasketProductType {
  status: string;
  data: {
      total_price: number;
      items: {
          product_id: string;
          product_slug: string;
          product_variant_id: string;
          product: string;
          product_variant_detail: {
              size: {
                  gram: number;
                  pieces: number;
                  total_services: number;
              };
              aroma: string;
              photo_src: string;
          };
          pieces: number;
          unit_price: number;
          total_price: number;
      }[];
  };
}