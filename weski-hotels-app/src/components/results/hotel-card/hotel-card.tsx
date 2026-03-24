import React, { useEffect, useState } from "react";
import "./hotel-card.scss";
import { Hotel } from "../../../types";
import Rating from "../../rating/rating";

interface Props {
  hotel: Hotel;
}

const FALLBACK_IMAGE = "/fallback%20hotel%20image.png";

const HotelCard: React.FC<Props> = ({ hotel }) => {
  const [imageSrc, setImageSrc] = useState(hotel.imageUrl || FALLBACK_IMAGE);
  const price = Math.round(hotel.pricePerPerson);

  useEffect(() => {
    setImageSrc(hotel.imageUrl || FALLBACK_IMAGE);
  }, [hotel.imageUrl]);

  const handleImageError = () => {
    if (imageSrc !== FALLBACK_IMAGE) {
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className="hotel-card">
      <img
        className="hotel-image"
        src={imageSrc}
        alt={hotel.name}
        loading="lazy"
        onError={handleImageError}
      />

      <div className="hotel-info">
        <div className="hotel-meta">
          <h3 className="hotel-name">{hotel.name}</h3>
          <Rating value={hotel.rating} />
          <p className="hotel-resort">
            <img className="location-icon" src="/location_circle.svg" alt="" aria-hidden="true" />
            <span>{hotel.resortName}</span>
          </p>
        </div>

        <div className="hotel-pricing">
          <hr className="hotel-divider" />

          <p className="hotel-price">
            {hotel.currency === "EUR" ? "€" : `${hotel.currency} `}
            {price}
            <span className="price-label">/ per person</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
