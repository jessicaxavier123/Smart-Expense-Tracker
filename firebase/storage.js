import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(path, file) {
    const imgRef = ref(storage, path);
    await uploadBytes(imgRef, file);
    return getDownloadURL(imgRef);
}
