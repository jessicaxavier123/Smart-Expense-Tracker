import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore }  from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    // ***
};


const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
//Export the auth object to use in other files
//export { auth };
