import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ref, get } from 'firebase/database';
import { realtimeDb } from './FirebaseConfig';

const imageMapping = {
  0: '/assets/a.png',
  1: '/assets/b.png',
  2: '/assets/c.png',
  3: '/assets/d.png',
  4: '/assets/e.png',
  5: '/assets/f.png',
  6: '/assets/g.png',
  7: '/assets/h.png',
  8: '/assets/i.png',
  9: '/assets/j.png',
  10: '/assets/k.png',
  11: '/assets/l.png',
  12: '/assets/m.png',
  13: '/assets/n.png',
  14: '/assets/o.png',
  15: '/assets/p.png',
  16: '/assets/q.png',
  17: '/assets/r.png',
  18: '/assets/s.png',
  19: '/assets/t.png',
  20: '/assets/u.png',
  21: '/assets/v.png',
  22: '/assets/w.png',
  23: '/assets/x.png',
  24: '/assets/y.png',
  25: '/assets/z.png',
};

const fetchAndSendData = async () => {
  try {
    // Lấy dữ liệu tilt
    const tiltData = [];
    for (let i = 1; i <= 11; i++) {
      const tiltRef = ref(realtimeDb, `/IoT/tilt/tilt_${i}`);
      const tiltSnapshot = await get(tiltRef);
      tiltData.push(tiltSnapshot.val());
    }
    // Lấy dữ liệu accel (9 giá trị)
    const accelRefs = [
      '/IoT/accel1_x',
      '/IoT/accel1_y',
      '/IoT/accel1_z',
      '/IoT/accel2_x',
      '/IoT/accel2_y',
      '/IoT/accel2_z',
      '/IoT/accel3_x',
      '/IoT/accel3_y',
      '/IoT/accel3_z',
    ];
    const accelData = await Promise.all(
      accelRefs.map(async (path) => {
        const snapshot = await get(ref(realtimeDb, path));
        return snapshot.val();
      })
    );

    // Chuẩn bị payload để gửi đến API
    const requestBody = {
      tilt: tiltData,
      accel: accelData,
    };

    console.log('Payload gửi API:', requestBody);

    // Gửi dữ liệu đến API
    const response = await fetch('https://personal-noelle-phananhlocpal-3ae312a3.koyeb.app/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    console.log('Phản hồi từ API:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching or sending data:', error);
    throw error;
  }
};

const LetterDisplay = () => {
  const [letters, setLetters] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchDataTriggered, setFetchDataTriggered] = useState(false);
  const navigate = useNavigate(); // Khởi tạo navigate

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login'); // Điều hướng nếu chưa đăng nhập
    }
  }, [navigate]);

  const fetchLetter = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAndSendData();
      const predictedLabel = data.predicted_label; // Nhận label từ API
      const letterFromClass = String.fromCharCode(65 + predictedLabel); // Chuyển đổi label thành chữ cái (1 -> 'A')
      setLetters((prevLetters) => prevLetters + letterFromClass); // Nối chữ cái vào chuỗi
      setImageSrc(imageMapping[predictedLabel]); // Lấy hình ảnh tương ứng với label
    } catch (error) {
      console.error('Error fetching the letter:', error);
    } finally {
      setIsLoading(false);
      setFetchDataTriggered(true);
    }
  };

  const speakLetter = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(letters);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ Speech Synthesis.');
    }
  };

  const clearLetters = () => {
    setLetters(''); // Xóa chuỗi các chữ cái
    setImageSrc(''); // Xóa hình ảnh hiển thị
  };

  return (
    <div className="text-center mt-12">
      <h1 className="text-2xl font-bold">Hiển thị và đọc chữ cái</h1>
      <div className="mt-6">
        <h2 className="text-xl mb-5">Chữ cái: {letters}</h2>
        {imageSrc && <img src={imageSrc} alt="Hình chữ cái" className="mx-auto mb-5 w-32 h-32" />}
        <button
          onClick={fetchLetter}
          className="px-4 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Đọc dữ liệu
        </button>
        <button
          onClick={speakLetter}
          className="px-4 py-2 text-lg bg-green-500 text-white rounded hover:bg-green-600 ml-4"
          disabled={!fetchDataTriggered}
        >
          Đọc chữ cái
        </button>
        <button
          onClick={clearLetters}
          className="px-4 py-2 text-lg bg-red-500 text-white rounded hover:bg-red-600 ml-4"
        >
          Clear
        </button>
      </div>
      {isLoading && <p className="text-gray-500 mt-4">Đang tải dữ liệu...</p>}
    </div>
  );
};

export default LetterDisplay;
