import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./FirebaseConfig";

export const login = async (email, password) => {
  try {
    // Đăng nhập người dùng
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Truy vấn thông tin người dùng từ Firestore
    const userDocRef = doc(db, "users", user.uid); // Tài liệu người dùng
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data(); // Lấy dữ liệu từ Firestore
      console.log("Đăng nhập thành công:", { uid: user.uid, ...userData });
      return { uid: user.uid, email: user.email, ...userData }; // Trả về đầy đủ thông tin
    } else {
      throw new Error("Không tìm thấy thông tin người dùng trong Firestore.");
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.message);
    throw error;
  }
};

export const register = async (email, password, fullName, address) => {
  try {
    // Đăng ký người dùng
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng trong Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: fullName,
      email: email,
      address: address,
      createdAt: new Date(),
    });

    console.log("Đăng ký thành công:", user);
    return user;
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error.message);
    throw error;
  }
};