    const express=require("express");
    const app=express();
    const mongoose=require("mongoose");
    const Listing = require("./models/listing.js");
    const path=require("path");

    const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));

    main().then(()=>{
        console.log("Connecting to db");
    }).catch(()=>{
        console.log(err);
    });

    async function main() {
        await mongoose.connect(mongo_url);
    }

    app.get("/",(req,res)=>{
        res.send("Hola Amigo");
    });

    // app.get("/testListing",async (req,res)=>{
    //     let sampleListing=new Listing({
    //         title: "My new Villa",
    //         description:"By Beach Side",
    //         price:3000,
    //         location: "Goa",
    //         country: "India",
    //     });
    //     await sampleListing.save();
    //     console.log("Sample Saved");
    //     res.send("successfully testing");
    // });

    app.get("/listings",async (req,res)=>{
        const allListening=await Listing.find({});
        res.render("listings/index",{allListening});
     
    });

    app.get("/listings/:id",async( req,res)=>{
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs",{listing});
    }
    );
    


    app.listen(8080,()=>{
        console.log("Server is Listening"); 
    });