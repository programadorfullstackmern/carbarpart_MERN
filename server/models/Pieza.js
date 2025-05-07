const mongoose = require("mongoose");
const piezaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: 100
    },
    descripcion: {
      type: String,
      required: true,
      maxlength: 500
    },
    categoria: {
      type: String,
      enum: ["motor", "suspension", "frenos", "electrico", "carroceria", "interior", "exterior", "otros"],
      required: true,
      index: true
    },
    marcaCompatibilidad: [String],
    modeloCompatibilidad: [String],
    anioMin: {
      type: Number,
      min: 1900
    },
    anioMax: {
      type: Number,
      min: 1900,
      validate: {
        validator: function(value) {
          return !this.anioMin || value >= this.anioMin;
        },
        message: 'El año máximo no puede ser menor al año mínimo'
      }
    },
    precio: {
      type: Number,
      required: true,
      min: 0
    },
    imagen: {
      type: String,
      default: "no-image.jpg"
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    autosCompatibles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auto" }],
    caracteristicas: [{ nombre: String, valor: String }],
    fechaCreacion: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
piezaSchema.index({ nombre: "text", descripcion: "text" });
piezaSchema.index({ categoria: 1, precio: 1 });

module.exports = mongoose.model("Pieza", piezaSchema);
