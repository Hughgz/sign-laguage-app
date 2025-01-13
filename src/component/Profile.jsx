import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./FirebaseConfig";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = localStorage.getItem("uid");
        if (!uid) {
          throw new Error("Người dùng chưa đăng nhập.");
        }

        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          throw new Error("Không tìm thấy thông tin người dùng trong Firestore.");
        }

        // Fetch history
        const lettersRef = collection(db, "user_letters");
        const q = query(lettersRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);

        const fetchedHistory = [];
        querySnapshot.forEach((doc) => {
          fetchedHistory.push(doc.data());
        });
        setHistory(fetchedHistory);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <img
            src="https://static.vecteezy.com/system/resources/previews/014/752/767/original/a-man-saying-a-friendly-word-or-a-phrase-young-good-looking-man-doing-greet-pose-and-say-something-flat-illustration-vector.jpg"
            alt="Avatar"
            className="w-32 h-32 rounded-full shadow-md mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Thông tin cá nhân</h1>
          </div>
        </div>
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "history" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử chữ cái
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="text-gray-600">
            {userData ? (
              <div>
                <p className="mb-2"><span className="font-semibold">Họ và tên:</span> {userData.fullName}</p>
                <p className="mb-2"><span className="font-semibold">Email:</span> {userData.email}</p>
                <p className="mb-2"><span className="font-semibold">Địa chỉ:</span> {userData.address}</p>
                <p className="mb-2"><span className="font-semibold">Ngày đăng ký:</span> {new Date(userData.createdAt.seconds * 1000).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-gray-500">Không có thông tin người dùng để hiển thị.</p>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="text-gray-600">
            <h2 className="text-xl font-semibold mb-4">Lịch sử chữ cái</h2>
            {history.length > 0 ? (
              <ul className="list-disc pl-6">
                {history.map((item, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold">Chữ cái:</span> {item.letters} - <span className="font-semibold">Thời gian:</span> {new Date(item.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Không có lịch sử để hiển thị.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
