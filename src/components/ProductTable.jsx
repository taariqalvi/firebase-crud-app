"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', description: '' });
    const [editingProduct, setEditingProduct] = useState(null); // State for tracking the product being edited

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection);
            setProducts(productsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };

        fetchProducts();
    }, []);

    const handleCreate = async () => {
        // Validation: Check if all fields are filled
        if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.description) {
            alert("Please fill in all fields before adding the product.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'products'), newProduct);
            setProducts([...products, { ...newProduct, id: docRef.id }]); // Update UI with the new product
            setNewProduct({ name: '', price: '', image: '', description: '' }); // Clear form fields
            alert("Product added to Firebase database");
        } catch (error) {
            alert("Error adding product: " + error.message);
        }
    };

    const handleUpdate = (product) => {
        setEditingProduct(product); // Set the selected product for editing
        setNewProduct({ name: product.name, price: product.price, image: product.image, description: product.description });
    };

    const handleSaveUpdate = async () => {
        if (editingProduct) {
            const productDoc = doc(db, 'products', editingProduct.id);
            await updateDoc(productDoc, newProduct);
            setProducts(products.map(p => (p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p))); // Update the UI with the updated product
            setEditingProduct(null); // Clear editing state
            setNewProduct({ name: '', price: '', image: '', description: '' });
            alert("Product updated successfully");
        }
    };

    const handleDelete = async (id) => {
        const productDoc = doc(db, 'products', id);
        await deleteDoc(productDoc);
        setProducts(products.filter(product => product.id !== id)); // Update UI by removing the deleted product
        alert("Product deleted successfully");
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
                            <td className="border px-4 py-2"><img src={product.image} alt={product.name} className="h-16 w-16 object-cover" /></td>
                            <td className="border px-4 py-2">{product.description}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleUpdate(product)} className="bg-yellow-500 text-white px-4 py-2">Edit</button>
                                <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-4 py-2 ml-2">
                                    Delete
                                </button>
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
                        <button onClick={handleSaveUpdate} className="bg-yellow-500 text-white px-4 py-2">
                            Update Product
                        </button>
                    ) : (
                        <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2">
                            Add Product
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
