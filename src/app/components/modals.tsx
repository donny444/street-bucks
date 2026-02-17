import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

interface confirmModalProps {
  show: boolean;
  onHide: () => void;
  onClick: () => void;
  title: string;
  body: string;
  footer: string;
}
export function ConfirmModal({
  show,
  onHide,
  onClick,
  title,
  body,
  footer,
}: confirmModalProps): React.JSX.Element {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClick}>
          {footer}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

interface NotifyModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  message: string;
}
export function NotifyModal({
  show,
  onHide,
  title,
  message,
}: NotifyModalProps): React.JSX.Element {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
    </Modal>
  );
}
