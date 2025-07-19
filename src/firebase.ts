import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAICMsMCE3EfgRPK_h6zmS0rz0PnNNl8Cg",
  authDomain: "uwb-localization-ebf72.firebaseapp.com",
  databaseURL: "https://uwb-localization-ebf72-default-rtdb.firebaseio.com", // ✅ important
  projectId: "uwb-localization-ebf72",
  storageBucket: "uwb-localization-ebf72.appspot.com", // ✅ fixed
  messagingSenderId: "266129292178",
  appId: "1:266129292178:web:35f67c661ef03233995f4b",
  measurementId: "G-L1L6KL7R1E"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
