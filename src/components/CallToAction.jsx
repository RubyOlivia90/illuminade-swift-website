import { Link } from "react-router-dom";

export default function CallToAction() {
  const buttonStyle = {
    backgroundColor: "var(--green)",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    fontSize: "1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    margin: "0 1rem",
    boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
    transition: "background-color 0.3s ease",
  };

  const hoverColor = "#5aa45a";

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = hoverColor;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <Link
        to="/store"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Store
      </Link>
      <Link
        to="/gallery"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Gallery
      </Link>
    </div>
  );
}
