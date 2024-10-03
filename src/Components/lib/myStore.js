import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";


 export const userStore = create((set) => (
{
    currentUser:null,  // this will store the current user's data fetched from the firestore
    isLoading: true, // this is a boolean flag to indicate whether the user data is being fetched. Initially true.
    fetchUserInfo: async(uid) =>
    {
        if(!uid) return set({currentUser: null , isLoading: false});  // if uid is null or invalid , it sets currentUser to null and isLoading to false. (indicating no user data is available)

        try
        {
            const docRef = doc(db, "users", uid); // creating document reference (docRef) from Firestore using the uid
            const docSnap = await getDoc(docRef); // retrieves the document snapshot 

            if(docSnap.exists())
            {
                set({currentUser: docSnap.data() , isLoading: false})  // In this we have got the user data so fetching process is complete , we can turn of the isLoading behaviour i.e False
            }
            
            else
            {
                set({currentUser: null , isLoading: false})  // In this we have no user data so fetching process is complete but no valid user data, we can turn of the isLoading behaviour i.e False
            }

        }

        catch(err)
        {
            return set({currentUser: null , isLoading: false});
        }
    }
}))