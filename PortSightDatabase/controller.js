const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost:27017/Logs' , { useNewUrlParser :
true , useUnifiedTopology : true , auto_reconnect : true, keepAlive : true});

//Define the Schema of the Database
var Catch = new mongoose.Schema({
	TimeStamp: Date,
	Latitude: Number,
	Longitude: Number,
	RelatedPhoto: String
})

// var SchoolofFish = new mongoose.Schema({
// 	StudentFish: this.Fish, //????
// 	Latitude: this.Fish.Latitude,
// 	Longitude: this.Fish.Longitude,
// 	Quantity: this.Fish.Quantity,
// 	LocalName: this.Fish.LocalName,
// 	NextFish: Null
// })

// var Fish = new mongoose.Schema({
// 	TimeStamp: Date,
// 	Latitude: Number,
// 	Longitude: Number,
// 	Quantity: Number,
// 	LocalName: String //Species
// })

var Record = new mongoose.Schema({
	TimeStamp: Date,
	Latitude: Number,
	Longitude: Number,
	Heading: Number,
	Speed: Number
})

var Session = new mongoose.Schema({
	StartTime:Date,
	EndTime: Date,
	ArrayOfRecords: [Record],
	ArrayOfCatches: [Catch]
})


var Boat = mongoose.model('Boat',{
	MacAddress: String,
	ArrayOfSessions: [Session]
})

exports.homepage = (req, res) => {
res.send( 'Welcome to the Homepage' )
}

//Endpoints for receiving JSON file from the phone
exports.save = (req,res) =>{
	const newBoat = new Boat({
	MacAddress : req.body.MacAddress,
	ArrayOfSessions : req.body.ArrayOfSessions
	})

	//Saving on the database
	newBoat.save((err) => {
		if (!err) {
		console.log( 'Saved!' )
		}else{
			console.log('Not Saved!')
		}
		})
	res.send({Status: 1})
}

//endpints for displaying the values from the database
exports.display = (req,res) =>{
	Boat.find({}, (err, boats) => {
		console.log(boats.length)
		for(var i =0; i< boats.length;i++){
			console.log("Boat "+i+"=======")
			console.log(boats[i].MacAddress)
			//ArrayOfRecords
			var ArrayOfSessions = boats[i].ArrayOfSessions
			console.log("Sessions")
			for(var j = 0; j<ArrayOfSessions.length;j++){
				console.log(ArrayOfSessions[j].StartTime)
				console.log(ArrayOfSessions[j].EndTime)
				//ArrayOfRecords
				var ArrayOfRecords = boats[i].ArrayOfSessions[j].ArrayOfRecords
				console.log("Records")
				for(var k = 0; k<ArrayOfRecords.length;k++){
					console.log(ArrayOfRecords[k].TimeStamp)
					console.log(ArrayOfRecords[k].Latitude)
					console.log(ArrayOfRecords[k].Longitude)
					console.log(ArrayOfRecords[k].Heading)
					console.log(ArrayOfRecords[k].Speed)
				}
				//ArrayOfCatches
				var ArrayOfCatches = boats[i].ArrayOfSessions[j].ArrayOfCatches
				console.log("Catches")
				for(var l = 0; l<ArrayOfCatches.length;l++){
					console.log(ArrayOfCatches[l].TimeStamp)
					console.log(ArrayOfCatches[l].Latitude)
					console.log(ArrayOfCatches[l].Longitude)
					console.log(ArrayOfCatches[l].RelatedPhoto)

				}
			}
		}

		});
	res.send({Status: 1})
	}

//Getting the All the Values from the database
exports.findAll = (req,res) =>{
	Boat.find({}, (err,boats)=>{
		var boat = []
		for(var i =0; i< boats.length;i++){
			boat.push(boats[i])
		}
		res.send({"boat":boat});
	})
}

exports.getAverageSpeed = (req,res) => {
	Boat.find({MacAddress:req.query.macaddress}, (err,boat)=>{
		console.log(boat.length)
		if(boat.length > 0){	// check if the array is empty
			var averageSpeed = [];

			var aveSpeed = 0;
			var totalTrip = 0;
			var sessionSpeed = [];

			var boatAddress = boat[0];
			for(var j =0 ; j<boatAddress.ArrayOfSessions.length ; j++){
					var Records = boatAddress.ArrayOfSessions[j].ArrayOfRecords;
					var speed = 0;
					var trips = 0;
			    for(var k = 0; k < Records.length ; k++){
						speed = speed + Records[k].Speed;
						trips = trips + 1;
					}
					sessionSpeed.push(speed/trips);
					aveSpeed = aveSpeed + speed;
					totalTrip = totalTrip + trips;
			}

			aveSpeed = aveSpeed/totalTrip;
			averageSpeed.push(aveSpeed);
			averageSpeed.push(sessionSpeed);
			res.send({"averageSpeed":averageSpeed});
		}
		else{
			res.send("Boat NOT found");
		}
	})
}
//geting the data of single boat
exports.getCertainBoat = (req,res) => {
	Boat.find({MacAddress:req.query.macaddress}, (err,boat)=>{
		if(boat.length > 0){	// check if the array is empty
			res.send({"boat":boat});
		}
		else{
			res.send("No MAcAddress Found");
		}
	})

}
