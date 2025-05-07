import { Modal } from 'react-bootstrap'

const ImageModal = ({ show, onHide, imageUrl, altText = '' }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Body className="p-0">
        <img 
          src={imageUrl} 
          alt={altText} 
          className="img-fluid w-100"
          style={{ maxHeight: '80vh', objectFit: 'contain' }}
        />
      </Modal.Body>
    </Modal>
  )
}

export default ImageModal