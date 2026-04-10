import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <Container
      className="text-center w-100 p-0 py-2 m-0 mt-auto"
      style={{ backgroundColor: "#E0EDBB", color: "#000000" }}
    >
      © {new Date().getFullYear()} StreetBucks
    </Container>
  );
}
