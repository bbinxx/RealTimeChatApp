// firestore_service.js

const { orderBy,getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot } = require("firebase/firestore");

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
    // Retrieve data from the specified collection, ordered by "time" in descending order
    const querySnapshot = await getDocs(
      collection(db, collectionName)
    );

    // Process the retrieved documents
    const dataList = [];
    querySnapshot.forEach((doc) => {
      dataList.push({ id: doc.id, ...doc.data() }); // Combine ID and data into objects
      dataList.sort((a, b) => a.time - b.time); // Sort by "time" in descending order

    });

    // Return the data if successful
    return { success: true, data: dataList };
  } catch (error) {
    // Handle errors
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