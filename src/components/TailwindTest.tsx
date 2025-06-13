'use client';

export default function TailwindTest() {
  return (
    <div className="p-4 m-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors">
      <h2 className="text-2xl font-bold mb-2">Tailwind CSS Test</h2>
      <p className="text-sm">
        If you can see this box with blue background and white text, Tailwind CSS is working correctly!
      </p>
      <div className="mt-4 flex space-x-2">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Button 1
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Button 2
        </button>
      </div>
    </div>
  );
} 