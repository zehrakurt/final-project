import { create } from 'zustand';
import { AddBasketToProduct, deleteFromCart, getCart } from '../routes/signup/auth';
import { getAccessToken } from '../routes/signup/storage';

interface Size {
    gram?: number;
    pieces: number;
    total_services: number;
}

interface CartItem {
    id: string;
    name: string;
    aroma?: string;
    size?: Size;
    price: number;
    count: number;
    image?: string;
    total_price?: number;
    product_variant_id?: string;
    product_id?: string;
    product_slug?: string;
}

interface CartStore {
    bears: CartItem[];
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    totalPrice: () => number;
    totalItems: () => number;
    addBear: (bear: CartItem) => Promise<void>;
    clearCart: () => void;
    removeBear: (itemToRemove: CartItem) => Promise<void>;
    increaseBearCount: (item: CartItem) => Promise<void>;
    decreaseBearCount: (item: CartItem) => Promise<void>;
    syncCartWithBackend: () => Promise<void>;
    getCartFromBackend: () => Promise<void>;
    setCartFromBackend: (items: any[]) => void;
    closeMainDrawer: () => void;
    isMainDrawerOpen: boolean;
    addItemToCart: (item: CartItem) => Promise<void>;
}

const useCartStore = create<CartStore>((set, get) => ({
    bears: [],
    isLoggedIn: false,
    setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
    totalPrice: () => get().bears.reduce((sum, bear) => sum + (bear.total_price || 0), 0),
    totalItems: () => get().bears.reduce((sum, bear) => sum + bear.count, 0),
    isMainDrawerOpen: false,
    closeMainDrawer: () => set({ isMainDrawerOpen: false }),

    addItemToCart: async (item) => {

        const existingItemIndex = get().bears.findIndex((b) => b.product_variant_id === item.product_variant_id);
        const access_token = getAccessToken();

        if (access_token) {
            const cartItemToSend = {
                product_id: parseInt(item.product_id!, 10),
                product_variant_id: item.product_variant_id,
                pieces: item.count || 1,
            };

            try {
                const response = await AddBasketToProduct(cartItemToSend);
                if (response?.status === 'success') {

                    await get().getCartFromBackend();

                } else {
                    console.error('Backend sepete ekleme hatası:', response);

                }
            } catch (error: any) {
                console.error('Backend sepete ekleme hatası:', error);


            }
        } else {
            set((state) => {
                if (existingItemIndex > -1) {
                    const updatedBears = [...state.bears];
                    updatedBears[existingItemIndex] = {
                        ...updatedBears[existingItemIndex],
                        count: updatedBears[existingItemIndex].count + (item.count || 1),
                        total_price: updatedBears[existingItemIndex].price * (updatedBears[existingItemIndex].count + (item.count || 1)),
                    };
                    return { bears: updatedBears };
                } else {
                    return { bears: [...state.bears, { ...item, total_price: item.price * (item.count || 1) }] };
                }
            });
        }
    },

    addBear: async (bear) => {
        await get().addItemToCart(bear);
    },

    clearCart: () => set({ bears: [] }),

    removeBear: async (itemToRemove) => {
        console.log('Silme isteği gönderildi:', itemToRemove);
        const originalBears = get().bears;
        set((state) => ({
            bears: state.bears.filter(
                (bear) =>
                    bear.product_variant_id !== itemToRemove.product_variant_id
            ),
        }));
        console.log('Silme sonrası local state:', get().bears);

        if (get().isLoggedIn && itemToRemove.product_variant_id && itemToRemove.product_id) {
            try {
                const payload = {
                    product_id: parseInt(itemToRemove.product_id, 10),
                    product_variant_id: itemToRemove.product_variant_id,
                    pieces: 1,
                };
                const response = await deleteFromCart(payload);
                if (response?.status !== 'success') {
                    console.error('Backend silme hatası:', response);
                    set({ bears: originalBears });
                    await get().getCartFromBackend();
                } else {
                    await get().getCartFromBackend();
                }
            } catch (error: any) {
                console.error('Backend silme hatası:', error);
                set({ bears: originalBears });
                await get().getCartFromBackend();
            }
        }
    },

    increaseBearCount: async (item) => {
        set((state) => {
            const updatedBears = state.bears.map((bear) =>
                bear.product_variant_id === item.product_variant_id
                    ? { ...bear, count: bear.count + 1, total_price: bear.price * (bear.count + 1) }
                    : bear
            );
            return { bears: updatedBears };
        });

        if (get().isLoggedIn && item.product_variant_id && item.product_id) {
            try {
                const payload = {
                    product_id: parseInt(item.product_id, 10),
                    product_variant_id: item.product_variant_id,
                    pieces: 1,
                };
                const response = await AddBasketToProduct(payload);
                if (response?.status !== 'success') {
                    console.error('Backend artırma hatası:', response);
                    await get().getCartFromBackend();
                }
                await get().getCartFromBackend();
            } catch (error: any) {
                console.error('Artırırken hata:', error);
            }
        }
    },

    decreaseBearCount: async (item) => {
        const originalBears = get().bears;
        set((state) => {
            const updatedBears = state.bears
                .map((bear) =>
                    bear.product_variant_id === item.product_variant_id
                        ? { ...bear, count: Math.max(1, bear.count - 1), total_price: bear.price * Math.max(1, bear.count - 1) }
                        : bear
                )
                .filter((bear) => bear.count > 0);
            return { bears: updatedBears };
        });

        if (get().isLoggedIn && item.product_variant_id && item.product_id && item.count > 1) {
            try {
                const payload = {
                    product_id: parseInt(item.product_id, 10),
                    product_variant_id: item.product_variant_id,
                    pieces: -1,
                };
                const response = await AddBasketToProduct(payload);
                if (response?.status !== 'success') {
                    console.error('Backend azaltma hatası:', response);
                    set({ bears: originalBears });
                    await get().getCartFromBackend();
                } else {
                    await get().getCartFromBackend();
                }
            } catch (error: any) {
                console.error('Azaltırken hata:', error);
                set({ bears: originalBears });
                await get().getCartFromBackend();
            }
        }
    },

    syncCartWithBackend: async () => {
        if (get().isLoggedIn && get().bears.length > 0) {
            const cartItems = get().bears.map((bear) => ({
                product_id: parseInt(bear.product_id || '', 10),
                product_variant_id: bear.product_variant_id,
                pieces: bear.count,
            }));
            try {
                const response = await AddBasketToProduct(cartItems as any);
                if (response?.status !== 'success') {
                    console.error('Sepet senkronizasyon hatası:', response);
                }
                await get().getCartFromBackend();
            } catch (error: any) {
                console.error('Senkronda hata:', error);
            }
        } else if (get().isLoggedIn && get().bears.length === 0) {
            console.log('Yerel sepet boş, senkronizasyona gerek yok.');
            await get().getCartFromBackend();
        } else {
            console.log('Giriş yapılmamış, sepet senkronize edilemez.');
        }
    },

    getCartFromBackend: async () => {
        if (get().isLoggedIn) {
            try {
                const response = await getCart();
                if (response?.status === 'success' && response.data?.items) {
                    console.log('Backend sepet verileri alındı:', response.data.items);
                    const backendCartItems = response.data.items.map((item: any) => ({
                        id: item.product_variant_id,
                        name: item.product,
                        product_slug: item.product_slug,
                        aroma: item.product_variant_detail?.aroma,
                        size: item.product_variant_detail?.size,
                        price: item.unit_price,
                        count: item.pieces,
                        image: `https://fe1111.projects.academy.onlyjs.com${item.product_variant_detail?.photo_src.startsWith('/') ? item.product_variant_detail.photo_src : '/' + item.product_variant_detail?.photo_src}`,
                        total_price: item.total_price,
                        product_variant_id: item.product_variant_id,
                        product_id: item.product_id,
                    }));
                    set({ bears: backendCartItems, isMainDrawerOpen: true });
                } else if (response?.status === 'success' && !response.data?.items) {
                    set({ bears: [], isMainDrawerOpen: true });
                    console.log('Backend sepet boş.');
                } else {
                    console.error('Backend sepet verisi alınamadı:', response);
                }
            } catch (error) {
                console.error('Backend sepet verisi alınırken hata:', error);
            }
        } else {
            console.log('Giriş yapılmamış, sepet verisi alınamaz.');
            set({ isMainDrawerOpen: true });
        }
    },

    setCartFromBackend: (items) => {
        set({
            bears: items.map((item: any) => ({
                id: item.product_variant_id,
                name: item.product,
                product_slug: item.product_slug,
                aroma: item.product_variant_detail?.aroma,
                size: item.product_variant_detail?.size,
                price: item.unit_price,
                count: item.pieces,
                image: `https://fe1111.projects.academy.onlyjs.com${item.product_variant_detail?.photo_src.startsWith('/') ? item.product_variant_detail.photo_src : '/' + item.product_variant_detail?.photo_src}`,
                total_price: item.total_price,
                product_variant_id: item.product_variant_id,
                product_id: item.product_id,
            })),
        });
    },
}));

export type { CartItem };
export { useCartStore };
