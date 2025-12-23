// firestore_service.js

const { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } = require("firebase/firestore");

const db = getFirestore();

exports.addData = async (collectionName, data) => {
  try {
    const res = await addDoc(collection(db, collectionName), data);
    return { success: true, id: res.id };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

exports.getAllData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const dataList = [];
    querySnapshot.forEach((doc) => {
      dataList.push({ id: doc.id, ...doc.data() });
    });
    dataList.sort((a, b) => a.time - b.time);
    return { success: true, data: dataList };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

exports.updateData = async (collectionName, id, data) => {
  try {
    await updateDoc(doc(db, collectionName, id), data);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

exports.deleteData = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};