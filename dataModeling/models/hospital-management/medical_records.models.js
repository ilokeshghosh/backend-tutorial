import mongoose from 'mongoose'

const medicalRecordsSchema = new mongoose.Schema({
    patientName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    hospitalName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    medicine: [{ type: String }],
    description: {
        type: String
    }
}, { timestamps: true })

export const MedicalRecords = mongoose.model('MedicalRecords', medicalRecordsSchema)