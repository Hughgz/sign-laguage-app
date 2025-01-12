import React from 'react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-blue-600 text-white w-full py-12 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">SmartSign</h1>
          <p className="text-lg mt-4">Kết nối không rào cản – SmartSign thấu hiểu ngôn ngữ của bạn</p>
          <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded shadow hover:bg-gray-100">Khám phá ngay</button>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-8">Tại sao chọn SmartSign?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <img src="/images/feature1.png" alt="Dễ sử dụng" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Dễ dàng sử dụng</h3>
            <p className="mt-2">Giao diện thân thiện, hỗ trợ mọi người ở mọi trình độ công nghệ.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <img src="/images/feature2.png" alt="Công nghệ AI" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Công nghệ AI hiện đại</h3>
            <p className="mt-2">Phân tích ngôn ngữ ký hiệu nhanh chóng và chính xác.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <img src="/images/feature3.png" alt="Hỗ trợ đa nền tảng" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Hỗ trợ đa nền tảng</h3>
            <p className="mt-2">Tích hợp dễ dàng trên cả thiết bị di động và máy tính.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white w-full py-12 text-center">
        <h2 className="text-2xl font-bold">Hãy để SmartSign giúp bạn giao tiếp dễ dàng hơn</h2>
        <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded shadow hover:bg-gray-100">Bắt đầu ngay</button>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white w-full py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 SmartSign. Tất cả các quyền được bảo lưu.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-blue-400 hover:underline">Facebook</a>
            <a href="#" className="text-blue-400 hover:underline">Twitter</a>
            <a href="#" className="text-blue-400 hover:underline">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
