import React, { useState, useCallback } from 'react'
import { Form, Card } from 'react-bootstrap'

const ImageUploader = ({ onFileSelect, initialImage }) => {
  const [preview, setPreview] = useState(initialImage || null)
  const [dragActive, setDragActive] = useState(false)


  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('Por favor, selecciona un archivo de imagen')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
      onFileSelect(file)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Form.Group>
          <Form.Label>Imagen</Form.Label>
          <div 
            className={`drop-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="img-thumbnail mb-2" />
            ) : (
              <p>Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
            )}
            <Form.Control 
              type="file" 
              accept="image/*" 
              onChange={handleChange}
              className="d-none"
              id="image-upload"
            />
            <Form.Label htmlFor="image-upload" className="btn btn-primary mt-2">
              Seleccionar Imagen
            </Form.Label>
          </div>
        </Form.Group>
      </Card.Body>
    </Card>
  )
}

export default ImageUploader