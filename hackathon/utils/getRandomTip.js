import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { tips } from "../assets/tipsData";

/**
 * Returns a random tip key for the given demographic.
 * @param {string} demographic
 * @returns {string} - tip translation key
 */
export const getRandomTipKeyByDemographic = (demographic = "student") => {
  const tipArray = tips[demographic] || tips["student"];
  const randomIndex = Math.floor(Math.random() * tipArray.length);
  return tipArray[randomIndex];
};

/**
 * Fetches the user's demographic from Firestore and returns a random tip key for that group.
 * @param {string} userId
 * @returns {Promise<string>} - tip translation key
 */
export const getRandomTipKey = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    let demographic = "student";
    if (docSnap.exists()) {
      const profile = docSnap.data();
      demographic = profile.demographic || "student";
    }
    return getRandomTipKeyByDemographic(demographic);
  } catch (error) {
    return getRandomTipKeyByDemographic("student");
  }
};
