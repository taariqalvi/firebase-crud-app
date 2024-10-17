"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', description: '' });
    const [editingProduct, setEditingProduct] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection);
            setProducts(productsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (product) => {
        // Add product to Firestore 'cart' collection
        try {
            const userId = auth.currentUser?.uid;
            await addDoc(collection(db, 'cart'), {
                ...product,
                quantity: 1,
                userId: userId
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const handleCreate = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.description) {
            alert("Please fill in all fields before adding the product.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'products'), newProduct);
            setProducts([...products, { ...newProduct, id: docRef.id }]);
            setNewProduct({ name: '', price: '', image: '', description: '' });
            alert("Product added to Firebase database");
        } catch (error) {
            alert("Error adding product: " + error.message);
        }
    };

    const handleUpdate = (product) => {
        setEditingProduct(product);
        setNewProduct({ name: product.name, price: product.price, image: product.image, description: product.description });
    };

    const handleSaveUpdate = async () => {
        if (editingProduct) {
            const productDoc = doc(db, 'products', editingProduct.id);
            await updateDoc(productDoc, newProduct);
            setProducts(products.map(p => (p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p)));
            setEditingProduct(null);
            setNewProduct({ name: '', price: '', image: '', description: '' });
            alert("Product updated successfully");
        }
    };

    const handleDelete = async (id) => {
        const productDoc = doc(db, 'products', id);
        await deleteDoc(productDoc);
        setProducts(products.filter(product => product.id !== id));
        alert("Product deleted successfully");
    };

    const handleBuyNow = (product) => {
        router.push(`/order?productId=${product.id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Price</th>
                        <th className="border px-4 py-2">Image</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.price}</td>
                            <td className="border px-4 py-2">
                                <div className="flex items-center">
                                    <img src={product.image} alt={product.name} className="h-16 w-16 object-cover" />
                                    <div className="ml-4 flex items-center gap-2">
                                        <FaShoppingCart
                                            className="text-green-500 cursor-pointer text-2xl"
                                            onClick={() => handleAddToCart(product)}
                                            title="Add to Cart"
                                        />
                                        <FaCreditCard
                                            className="text-blue-500 cursor-pointer text-2xl"
                                            onClick={() => handleBuyNow(product)}
                                            title="Buy Now"
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="border px-4 py-2">{product.description}</td>
                            <td className="border px-4 py-2 flex gap-2">
                                <button onClick={() => handleUpdate(product)} className="bg-yellow-500 text-white px-4 py-1">Edit</button>
                                <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-4 py-1">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Create or Update Product Form */}
            <div className="mt-8">
                <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="border p-2"
                    />
                    <input
                        type="text"
                        placeholder="Product Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="border p-2"
                    />
                    <input
                        type="text"
                        placeholder="Product Image URL"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="border p-2"
                    />
                    <textarea
                        placeholder="Product Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="border p-2"
                    />
                    {editingProduct ? (
                        <button onClick={handleSaveUpdate} className="bg-yellow-500 text-white px-4 py-2">Update Product</button>
                    ) : (
                        <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2">Add Product</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
