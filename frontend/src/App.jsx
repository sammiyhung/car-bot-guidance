import React, { useEffect, useState } from 'react';
import UserForm from './components/UserForm';
import Chatbot from './components/Chatbot';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
        setLoading(false);
      });

    socket.on('newVehicle', (newVehicle) => {
      setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    });

    return () => {
      socket.off('newVehicle');
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      {/* Header */}
      <header className="bg-black text-white p-4 flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Online Automobile Purchase Chatbot</h1>
      </header>

      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-96 text-center flex flex-col justify-center items-center w-full"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')", // Replace with actual image URL
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backgroundBlendMode: "darken"
        }}>
        <h2 className="text-4xl font-bold text-white mb-4">
          Welcome to Our Automobile Company
        </h2>
        <p className="text-xl text-white mb-6">
          Need help choosing the right car that suits your need?
        </p>
        <button className="bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
          Chat with our Bot
        </button>
      </div>

      {/* Main content */}
      <main className="flex-grow w-full bg-gray-200">
        <div className="w-full flex justify-between">
          {/* First column */}
          <div className="w-full">
            {/* Recommended cars grid */}
            <section className="mb-6 w-full">
              <h2 className="text-xl font-semibold mb-4 mt-16 text-black p-8 text-center">Recommended Vehicles</h2>
              <div className="grid grid-cols-4 gap-4 w-full">
                {vehicles.slice(0, 8).map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flip-card w-full h-64 bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
                  >
                    {/* Card Inner - flip effect */}
                    <div className="flip-card-inner">
                      {/* Front of the card */}
                      <div className="flip-card-front flex justify-center items-center bg-black text-white p-4">
                        <p className="text-lg font-bold">{vehicle.make} {vehicle.model}</p>
                      </div>
                      {/* Back of the card */}
                      <div className="flip-card-back bg-gray-100 text-black flex flex-col justify-center items-center p-4">
                        <p><strong>Year:</strong> {vehicle.year}</p>
                        <p><strong>Price:</strong> ${vehicle.price}</p>
                        <p><strong>Engine:</strong> {vehicle.engine_type}</p>
                        <p><strong>Fuel Economy:</strong> {vehicle.fuel_economy}</p>
                        <p><strong>Description:</strong> {vehicle.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* User registration */}
            <section className="bg-white p-4 shadow-lg rounded-lg w-full">
              <h2 className="text-xl font-semibold mb-4 text-black text-center">Register for More Recommendations</h2>
              <UserForm />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white text-center p-4 w-full">
        &copy; {new Date().getFullYear()} Raymond's Project
      </footer>

      {/* Chatbot fixed icon */}
      <Chatbot />
    </div>
  );
}

export default App;
