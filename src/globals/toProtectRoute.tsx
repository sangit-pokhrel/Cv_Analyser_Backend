// "use client";

// import { getRedirectResult, getIdToken, onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       // Handle redirect result first
//       const result = await getRedirectResult(auth);

//       if (result?.user) {
//         const token = await getIdToken(result.user, true);
//         document.cookie = `firebaseToken=${token}; path=/;`;
//         setLoading(false);
//         return;
//       }

//       // Normal auth state check
//       const unsubscribe = onAuthStateChanged(auth, async (user) => {
//         if (user) {
//           const token = await getIdToken(user, true);
//           document.cookie = `firebaseToken=${token}; path=/;`;
//           setLoading(false);
//         } else {
//           router.push("/login");
//         }
//       });

//       return unsubscribe;
//     };

//     checkAuth();
//   }, [router]);

//   if (loading) {
//     return <p className="text-center mt-10">Checking authentication...</p>;
//   }

//   return <>{children}</>;
// };

// export default ProtectRoute;
