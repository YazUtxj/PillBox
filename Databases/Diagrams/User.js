import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
	name: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	password: { type: String, required: true },
	containers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Containers' }],
}, { versionKey: false });

const DHTSchema = new Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	temp: { type: Number, required: true },
	humidity: { type: Number, required: true },
	date_register: { type: Date, required: true }	
})

const ContainersSchema = new Schema({
	name_container: { type: String, required: true },
	init_time: { type: Date },
	hours: { type: Number },
	days: { type: Number },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { versionKey: false });

const RecordSchema = new mongoose.Schema({
	specific_container: { type: mongoose.Schema.Types.ObjectId, ref: "Containers" },
	alarm_date: { type: Date, required: true, default: Date.now },
	taken: { type: Boolean, required: true, default: false },
});

const User = mongoose.model('User', UserSchema)
const DHTData = mongoose.model('DHTData', DHTSchema)
const RecordData = mongoose.model('RecordData', RecordSchema)
const Containers = mongoose.model('Containers', ContainersSchema)

export { User, Containers, RecordData, DHTData }
