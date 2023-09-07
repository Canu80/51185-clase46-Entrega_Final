import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    thumbnail:{
        type: String,   
        require: true
    },
    code:{
        type: String,
        require: true
    },
    stock:{
        type: Number,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{ collection: "Products" })

productSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model("products", productSchema);

export default productsModel;