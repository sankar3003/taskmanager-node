const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed',
'in-progress'

    ], default: 'pending' },
    priority:{type:String, enum:['low', 'medium', 'high'], default:'medium'},
    dueDate:{type:Date},
    recurring:{type:String, enum:['daily', 'monthly','weekly', null],default:null},
    isArchived:{type:Boolean, default:false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
