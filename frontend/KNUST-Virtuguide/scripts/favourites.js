import { db } from "./firebaseConfig.js";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

export async function removeFromFavorites(name) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to remove favorites.");
    return;
  }

  try {
    const q = query(
      collection(db, "favourites"),
      where("userId", "==", user.uid),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "favourites", docSnap.id));
    });

    alert(`${name} has been removed from your favorites!`);

    // Remove from UI
    document
      .querySelector(`[data-location="${name}"]`)
      .closest(".favorite-item")
      .remove();
  } catch (error) {
    console.error("Error removing location: ", error);
  }
}

// Attach event listeners to remove buttons
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const locationName = event.target.getAttribute("data-location");
      await removeFromFavorites(locationName);
    });
  });
});
