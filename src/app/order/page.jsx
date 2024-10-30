"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const OrderPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productId = searchParams.get('productId');
    const [product, setProduct] = useState(null);

    // Fetch product details based on productId
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            const productDoc = await getDoc(doc(db, 'products', productId));
            if (productDoc.exists()) {
                setProduct({ id: productDoc.id, ...productDoc.data() });
            } else {
                console.error("Product not found");
            }
        };

        fetchProduct();
    }, [productId]);

    // Handle Stripe checkout
    const handleBuyNow = async () => {
        if (!product) return;

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: [
                        {
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                        }
                    ]
                }),
            });

            if (!response.ok) throw new Error('Failed to create checkout session');

            const { url } = await response.json();
            router.push(url);
        } catch (error) {
            console.error('Error redirecting to Stripe:', error);
        }
    };

    if (!product) return <p>Loading product...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order Page</h1>
            <div className="border p-4 rounded shadow">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p>Price: PKR {Number(product.price).toFixed(2)}</p>
                <img src={product.image} alt={product.name} className="h-32 w-32 object-cover mt-2" />
                <button
                    onClick={handleBuyNow}
                    className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default OrderPage;
