// ProductPreview.tsx

import React from 'react';
import { Product } from "./types.ts";
import { HStack, VStack } from "../../styled-system/jsx";
import { useProductVariants } from "../../hooks/use-product-variants.ts";
import { Button } from "./Button.tsx";
import { Text } from "./Text.tsx";

interface Props {
    product: Product;
}

export function ProductPreview({ product }: Props) {
    const {
        selectedVariant,
        productAromas,
        productSizes,
        isSizeAvailable,
        isSelectedAroma,
        isSelectedSize,
        selectAroma,
        selectSize,
    } = useProductVariants(product.variants);

    return (
        <HStack>
            <pre>{JSON.stringify(selectedVariant, null, 2)}</pre>
            <VStack alignItems={"start"}>
                <Text>Aroma</Text>
                <HStack>
                    {productAromas.map((aroma, index) => (
                        <Button
                            key={index}
                            selected={isSelectedAroma(aroma)}
                            onClick={() => selectAroma(aroma)}
                        >
                            {aroma}
                        </Button>
                    ))}
                </HStack>
                <Text>Boyut</Text>
                <HStack>
                    {productSizes.map((size, index) => (
                        <Button
                            disabled={isSizeAvailable(size)}
                            key={index}
                            onClick={() => selectSize(size)}
                            selected={isSelectedSize(size)}
                        >
                            {size.pieces} x {size.total_services}
                        </Button>
                    ))}
                </HStack>
            </VStack>
        </HStack>
    );
}