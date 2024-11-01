"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Messages from '@/components/Messages';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => doc.data());
            setUsers(usersList);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

                <div className="flex flex-col md:flex-row items-start gap-4">
                    {/* Users Table */}
                    <div className="flex-1">
                        <h3 className="text-2xl text-center font-bold mt-6 md:mt-0 bg-slate-600 text-white py-4 rounded-lg shadow-lg">Users</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-md">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-2 px-4">Name</th>
                                        <th className="py-2 px-4">Email</th>
                                        <th className="py-2 px-4">Phone</th>
                                        <th className="py-2 px-4">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={index} className="text-center even:bg-gray-100 hover:bg-gray-50">
                                            <td className="py-2 px-4">{user.name}</td>
                                            <td className="py-2 px-4">{user.email}</td>
                                            <td className="py-2 px-4">{user.phone}</td>
                                            <td className="py-2 px-4">{user.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="">
                        <h3 className="text-2xl text-center font-bold bg-slate-600 text-white py-4 rounded-lg shadow-lg">Notifications</h3>
                        <div className="mt-4 md:mt-0">
                            <Messages />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
