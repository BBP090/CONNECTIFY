import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { BASE_URL } from "../../config/config"; // adjust the path as needed


const useGetUserID = () => {
  const { user } = useUser();
  const [emailAddress, setEmailAddress] = useState('');
  const [userId, setUserId] = useState(null);

  // 1️⃣ Extract email from Clerk user
  useEffect(() => {
    if (user && user.emailAddresses.length > 0) {
      const email = user.emailAddresses[0].emailAddress;
      setEmailAddress(email);
    } else {
      console.warn("User or email not available from Clerk.");
    }
  }, [user]);

  // 2️⃣ Fetch user ID from your backend using the email
  useEffect(() => {
    const fetchUserId = async () => {
      if (!emailAddress) return;

      try {
        const res = await fetch(`${BASE_URL}/get-user-id`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailAddress }),
        });

        const data = await res.json();
        if (res.ok) {
          setUserId(data.id);
        } else {
          console.error("Failed to fetch user ID:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [emailAddress]);

  return { userId, emailAddress, loading: !userId && !!emailAddress };
};

export default useGetUserID;
