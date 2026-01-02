




export  const handleWhatsAppShare = () => {
    const currentUrl = window.location.href;
    const text = `Check this out: ${currentUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");
  };
