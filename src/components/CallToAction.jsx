import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <div className="cta-container">
      <Link to="/store" className="cta-button">
        Store
      </Link>
      <Link to="/gallery" className="cta-button">
        Gallery
      </Link>
    </div>
  );
}