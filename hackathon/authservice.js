import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const createUserProfile = async (user) => {
  if (!user) {
    console.log("No user provided to createUserProfile");
    return;
  }

  try {
    console.log("Creating user profile for:", user.uid);
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Anonymous",
        username: user.email.split("@")[0].toLowerCase(),
        profilePicture: user.photoURL || null,
        bio: "Hey! I'm new here 👋", // default bio
        createdAt: new Date(),
      });
      console.log("New user profile created!");
    } else {
      console.log("User already exists in Firestore");
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

// Listen to auth changes
onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed:", user);
  if (user) {
    createUserProfile(user);
  }
});
