import { Modal, Button, Spinner } from 'react-bootstrap'

const FormModal = ({ 
  show, 
  onHide, 
  onSubmit, 
  title, 
  children, 
  loading = false,
  submitText = 'Guardar',
  submitDisabled = false,
  size = 'lg'
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size={size}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={onSubmit}
          disabled={loading || submitDisabled}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" />
              <span className="ms-2">Procesando...</span>
            </>
          ) : submitText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FormModal