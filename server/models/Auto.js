const mongoose = require("mongoose");
const caracteristicaSchema = new mongoose.Schema({
  nombre: String,
  valor: String,
});

const autoSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: 50
    },
    modelo: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: 50
    },
    anio: {
      type: Number,
      required: true,
      index: true,
      min: 1900
    },
    precio: {
      type: Number,
      index: true,
      required: true,
      min: 0
    },
    imagen: {
      type: String,
      default: "no-image.jpg"
    },
    kilometraje: Number,
    color: String,
    transmision: {
      type: String,
      enum: ["manual", "automatica", "semi-automatica"]
    },
    combustible: {
      type: String,
      enum: ["gasolina", "diesel", "electrico", "hibrido"]
    },
    fechaRegistro: { type: Date, default: Date.now },
    caracteristicas: [caracteristicaSchema],
    opcionales: [String],
    disponible: Boolean,
    ubicacion: { ciudad: String, estado: String },
    piezas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pieza" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

autoSchema.index({ marca: 1, modelo: 1 });
autoSchema.index({
  marca: "text",
  modelo: "text",
  color: "text",
  "ubicacion.ciudad": "text",
  "ubicacion.estado": "text",
});

module.exports = mongoose.model("Auto", autoSchema);
