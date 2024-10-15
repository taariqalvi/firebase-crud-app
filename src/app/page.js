import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold">Welcome to the E-commerce App</h1>
        <p className="mt-4">This is a simple e-commerce app with Firebase Authentication and Product Management.</p>
      </div>
    </div>
  );
}
