"use client"
import { useRouter } from "next/navigation";
// export const metadata:Metadata ={
//   title:"Job Details",
//   icons:"/globe.svg"
// }

const JobsDetails = ()=>{
  const router = useRouter();

  const handleShare = () => {
    const currentUrl = window.location.href;

    const redirectUri = encodeURIComponent(currentUrl);

    // Messenger share URL without App ID
    const messengerShareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      currentUrl
    )}&redirect_uri=${redirectUri}`;

    window.open(messengerShareUrl, "_blank", "width=600,height=400");
  };

  return (
    <button
      onClick={handleShare}
      className="bg-blue-600 text-white px-4 py-2 rounded mt-20"
    >
      Share on Facebook
    </button>
  );
}

export default JobsDetails;