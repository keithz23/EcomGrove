import React from "react";

export default function GoogleMap() {
  return (
    <div className="relative w-full h-96 text-right my-10">
      <div className="w-full h-full overflow-hidden bg-transparent">
        <iframe
          className="w-full h-full"
          src="https://maps.google.com/maps?width=600&height=400&hl=en&q=HCMUT&t=p&z=14&ie=UTF8&iwloc=B&output=embed"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          title="Google Map"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
