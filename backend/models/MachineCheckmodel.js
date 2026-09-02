const mongoose = require('mongoose');

const machineCheckSchema = new mongoose.Schema({
     name:{
        type:String,
        required:true
     },
     confirmed:{
        type:Boolean,
        default:false
     }

},{Timestamps:true} );

const MachineCheck = mongoose.model("MachineCheck", machineCheckSchema);

module.exports = MachineCheck;
