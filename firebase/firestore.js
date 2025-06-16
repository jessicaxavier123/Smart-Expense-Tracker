// src/firebase/firestore.js
import { db } from "./firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    deleteDoc,
    addDoc,
    setDoc,
    updateDoc
} from "firebase/firestore";


// existing fetchReceipts…
export async function fetchReceipts(userId) {
    const q    = query(
    collection(db, "users", userId, "receipts"),
    orderBy("date", "desc")
    );
    const snap = await getDocs(q);

    return snap.docs.map(d => {
    const data = d.data();
    return {
        id:           d.id,
        date:         data.date.toDate(),
        amount:       data.amount ?? 0,
        locationName: data.locationName ?? '',
        address:      data.address      ?? '',   
        items:        data.items        ?? '',   
        imageUrl:     data.imageUrl     ?? ''
    };
    });
}


// deleteReceipt…
export async function deleteReceipt(userId, receiptId) {
    const ref = doc(db, "users", userId, "receipts", receiptId);
    await deleteDoc(ref);
}

// addReceipt…
export async function addReceipt(userId, data) {
    if (!userId) {
    console.error("addReceipt called without userId!", { userId, data });
    throw new Error("addReceipt: missing userId");
    }
    console.log("addReceipt: writing receipt for", userId, "=>", data);

    const receiptsCol = collection(db, "users", userId, "receipts");
    const ref         = await addDoc(receiptsCol, data);

    return ref;
}

export async function updateReceipt(userId, receiptId, data) {
    const ref = doc(db, 'users', userId, 'receipts', receiptId);
    await setDoc(ref, data, { merge: true });
}

