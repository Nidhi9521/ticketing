import mongoose from "mongoose";
import {password} from "../services/password"
interface UserAttrs{
    email:String
    password: String 
}


interface UserModel extends mongoose.Model<UserDoc>  {
    build(attrs:UserAttrs):UserDoc;
}

interface UserDoc extends mongoose.Document{
    email:string
    password:string
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
},{
    toJSON:{
         transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
         }
    }
})

userSchema.pre('save',async function(done) {
     if(this.isModified('password')){
        const hashed = await password.toHash(this.get('password'));
        this.set('password',hashed);
     }
     done();
})

const buildUser = (attrs:UserAttrs)=>{
    return new User(attrs);
}

userSchema.statics.build = (attrs:UserAttrs)=>{
    return new User(attrs);
}
const User = mongoose.model<UserDoc,UserModel>('User',userSchema)

const user=User.build({
    email: 'Test@gmail.com',
    password: 'edsfxcg'
})
 

export {User};