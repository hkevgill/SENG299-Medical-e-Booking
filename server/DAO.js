// Here we implement all the CRUD operations for the database
// Along with all our schemas etc. We then export the functionality
// for use in main

var mongoose = requre("mongoose");

var schemas = {
  appointment: mongoose.Schema({
      appointment_id:"number",
      date:"string",
      physician:"string",
      description:"string",
      netlink_id:"string"
  }),
  user: mongoose.Schema({
    netlink_id:"string",
    netlink_password:"string",
    name_first:"string",
    name_last:"string",
    carecard_num:"number"
  }),
  //I think event is a keyword, so i called account events "fiestas"
  fiesta: mongoose.Schema({
    event_id:"number",
    event_time:"string",
    event_description:"string",
    netlink_id:"string"
  })
};

var models = {
  appointment: mongoose.model("appointment", schemas.appointment),
  user: mongoose.model("user", schemas.user),
  fiesta: mongoose.model("fiesta", schemas.fiesta)
}

// Connect to the database. We could later store these paramaters
// in a config file, but for now we can hardcode them
mongoose.connect("localhost", "seng299");


// Here we put the basic CRUD operations, and any other
// fancy data access functions we want to make available



// Export the functions so they are available outside of this module
