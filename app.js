    const express=require("express");
    const app=express();
    const mongoose=require("mongoose");
    const Listing = require("./models/listing.js");
    const path=require("path");
    const methodOverride = require("method-override");
    const ejsMate=require("ejs-mate");

    const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride("_method"));
    app.engine('ejs',ejsMate);
    app.use(express.static(path.join(__dirname,"/public")))

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

    //New Route
    app.get("/listings/new", (req,res)=>{
        res.render("listings/new"); 
     
    });

    //Show Route
    app.get("/listings/:id",async( req,res)=>{
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs",{listing});
    }
    );

    //Create Route
    app.post("/listings",async (req,res,next)=>{
        try {
            const newListing = new Listing(req.body.listing);
            await newListing.save();
            res.redirect("/listings");
        } catch (err) {
            next(err);
        }
    });

    //Edit Route
    app.get("/listings/:id/edit",async(req,res)=>{
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});
    });

    //Update Route
    app.put("/listings/:id", async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`);
    });

    //Delete Route
    app.delete("/listings/:id",async (req,res)=>{
        let {id} = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    });

    app.use((err,req,res,next)=>{
        res.send("Something Went Wrong");
    })


    app.listen(8080,()=>{
        console.log("Server is Listening"); 
    }); 