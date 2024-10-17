"use client"
import Image from 'next/image';
import { useState } from 'react';

const Order = ({ orderedItems }) => {
    const [zoom, setZoom] = useState(null);

    const handleZoom = (id) => {
        setZoom(id);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Order</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orderedItems?.map(item => (
                    <div key={item.id} className="flex flex-col items-center">
                        <div
                            className="relative cursor-zoom-in"
                            onClick={() => handleZoom(item.id)}
                        >
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={zoom === item.id ? 600 : 300}
                                height={zoom === item.id ? 600 : 300}
                                className={zoom === item.id ? "object-cover" : ""}
                            />
                        </div>
                        <h2>{item.name}</h2>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Order;
