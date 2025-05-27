import { useState, useMemo } from 'react';

interface Variant {
    id: number;
    photo_src: string;
    aroma: string;
    size: {
        gram?: number;
        pieces: number;
        total_services: number;
    };
    price: {
        total_price: number;
        discounted_price: number | null;
        price_per_servings: number;
    };
}

export const useProductVariants = (variants: Variant[] | undefined) => {
    const [selectedAroma, setSelectedAroma] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<{ gram?: number; pieces: number; total_services: number } | null>(null);

    const filteredVariants = useMemo(() => {
        return variants ? variants.filter(v => v !== null && v !== undefined) : [];
    }, [variants]);

    const productAromas = useMemo(() => {
        if (!filteredVariants) return [];
        return Array.from(new Set(filteredVariants.map(variant => variant.aroma)));
    }, [filteredVariants]);

    const productSizes = useMemo(() => {
        if (!filteredVariants) return [];
        return Array.from(new Set(filteredVariants.map(variant => JSON.stringify(variant.size)))).map(size => JSON.parse(size));
    }, [filteredVariants]);

    const selectedVariant = useMemo(() => {
        if (!filteredVariants || !selectedAroma || !selectedSize) return null;
        return filteredVariants.find(variant => variant.aroma === selectedAroma && JSON.stringify(variant.size) === JSON.stringify(selectedSize)) || null;
    }, [filteredVariants, selectedAroma, selectedSize]);

    const isSelectedAroma = (aroma: string) => selectedAroma === aroma;
    const isSelectedSize = (size: { gram?: number; pieces: number; total_services: number }) => JSON.stringify(selectedSize) === JSON.stringify(size);

    const selectAroma = (aroma: string) => setSelectedAroma(aroma);
    const selectSize = (size: { gram?: number; pieces: number; total_services: number }) => setSelectedSize(size);

    const isSizeAvailable = (size: { gram?: number; pieces: number; total_services: number }) => {
        if (!filteredVariants || !selectedAroma) return true;
        return filteredVariants.some(variant => {
            if (!variant || !variant.aroma || !variant.size) return false;
            return variant.aroma === selectedAroma && JSON.stringify(variant.size) === JSON.stringify(size);
        });
    };

    return {
        selectedVariant,
        productAromas,
        productSizes,
        isSelectedAroma,
        isSelectedSize,
        selectAroma,
        selectSize,
        isSizeAvailable,
        selectedSize,
    };
};