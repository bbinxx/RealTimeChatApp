// firestore_service.js

const { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } = require("firebase/firestore");
const logger = require('../utils/logger');

const db = getFirestore();

exports.addData = async (collectionName, data) => {
  try {
    const res = await addDoc(collection(db, collectionName), data);
    logger.info(`Added document to ${collectionName} with ID: ${res.id}`);
    return { success: true, id: res.id };
  } catch (error) {
    logger.error(`Error adding document to ${collectionName}: ${error.message}`);
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
    // Assuming 'time' field exists for sorting, check if elements have it
    dataList.sort((a, b) => (a.time || 0) - (b.time || 0));

    logger.info(`Fetched ${dataList.length} documents from ${collectionName}`);
    return { success: true, data: dataList };
  } catch (error) {
    logger.error(`Error fetching data from ${collectionName}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

exports.updateData = async (collectionName, id, data) => {
  try {
    await updateDoc(doc(db, collectionName, id), data);
    logger.info(`Updated document ${id} in ${collectionName}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error updating document ${id} in ${collectionName}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

exports.deleteData = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    logger.info(`Deleted document ${id} from ${collectionName}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error deleting document ${id} from ${collectionName}: ${error.message}`);
    return { success: false, error: error.message };
  }
};