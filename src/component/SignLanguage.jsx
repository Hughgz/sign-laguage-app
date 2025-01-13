import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { saveLettersToFirestore } from "./Auth";
import { firestore, realtimeDb } from './FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
    const tiltData = [];
    for (let i = 1; i <= 11; i++) {
      const tiltRef = ref(realtimeDb, `/IoT/tilt/tilt_${i}`);
      const tiltSnapshot = await get(tiltRef);
      tiltData.push(tiltSnapshot.val());
    }

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

    const requestBody = {
      tilt: tiltData,
      accel: accelData,
    };

    const response = await fetch('https://personal-noelle-phananhlocpal-3ae312a3.koyeb.app/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching or sending data:', error);
    throw error;
  }
};

const fetchUserLetters = async () => {
  try {
    const userId = localStorage.getItem('uid');
    const lettersRef = collection(firestore, 'user_letters');
    const q = query(lettersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const history = [];
    querySnapshot.forEach((doc) => {
      history.push(doc.data());
    });

    return history;
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử chữ cái:', error);
  }
};

const LetterDisplay = () => {
  const [letters, setLetters] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchDataTriggered, setFetchDataTriggered] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('uid');
    if (!userId) {
      console.error('Người dùng chưa đăng nhập, điều hướng về trang login.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      const userHistory = await fetchUserLetters();
      setHistory(userHistory);
    };

    fetchHistory();
  }, []);

  const fetchLetter = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAndSendData();
      const predictedLabel = data.predicted_label;
      const letterFromClass = String.fromCharCode(65 + predictedLabel);
  
      // Cập nhật state `letters` và lưu vào Firestore một cách tách biệt
      setLetters((prevLetters) => {
        const updatedLetters = prevLetters + letterFromClass;
        saveLettersToFirestore(updatedLetters); // Lưu vào Firestore
        return updatedLetters;
      });
  
      setImageSrc(imageMapping[predictedLabel]);
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
    setLetters('');
    setImageSrc('');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">SmartSign - Hiển thị và đọc chữ cái</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 w-11/12 md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chữ cái:</h2>
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700">{letters || 'Chưa có chữ cái nào'}</p>
          {imageSrc && <img src={imageSrc} alt="Hình chữ cái" className="mx-auto mt-4 w-24 h-24" />}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={fetchLetter}
            className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 focus:outline-none"
          >
            Đọc dữ liệu
          </button>
          <button
            onClick={speakLetter}
            className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 focus:outline-none"
            disabled={!fetchDataTriggered}
          >
            Đọc chữ cái
          </button>
          <button
            onClick={clearLetters}
            className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600 focus:outline-none"
          >
            Clear
          </button>
        </div>
        {isLoading && <p className="text-center text-gray-500 mt-6">Đang tải dữ liệu...</p>}
      </div>
    </div>
  );
};

export default LetterDisplay;
