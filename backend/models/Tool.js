const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
    toolNumber:{
        type:String,
        required: true
    },
    toolType:{
        type:String,
        required: true          
    },  
    cncProgram:{
        type:String,
        required: true
    },
    programRevision:{
        type:String,
        required: true 
    }
    ,
    confirmed:{
        type:Boolean,
        default:false
    }
},{
Timestamps:true} );

const Tool = mongoose.model("Tool", toolSchema);        

module.exports = Tool;  