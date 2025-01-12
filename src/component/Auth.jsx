import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc} from "firebase/firestore";
import { auth, db } from "./FirebaseConfig";

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu `uid` vào localStorage
    localStorage.setItem('uid', user.uid);

    // Lấy thông tin người dùng từ Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Đăng nhập thành công:", { uid: user.uid, ...userData });
      return { uid: user.uid, email: user.email, ...userData };
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

export const saveLettersToFirestore = async (letters) => {
  try {
    const userId = localStorage.getItem('uid'); // Lấy `uid` từ localStorage
    if (!userId) {
      console.error('User ID not found in localStorage');
      throw new Error('Người dùng chưa đăng nhập');
    }

    const lettersRef = collection(db, 'user_letters'); // Đảm bảo bạn dùng `db` từ Firestore
    await addDoc(lettersRef, {
      userId,
      letters,
      timestamp: new Date().toISOString(),
    });

    console.log('Lưu chữ cái thành công vào Firestore');
  } catch (error) {
    console.error('Lỗi khi lưu chữ cái vào Firestore:', error);
    throw error;
  }
};
