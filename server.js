const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const { asyncScheduler } = require("rxjs");

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(cors({origin: true, credentials: true}));

const stripe = require("stripe")("sk_test_51NXLNCAQcbnrGaFbeQY9fzxEOpVFAo0jurtVfjIGaQTTItmPNcxeRLPZQMxXTK3Ux0tAVoGOUZcMkmtTYQzpsrDx00mlRyarXN")
 app.post("/checkout", async(req, res, next) => {
    try{
        const session = await stripe.checkout.sessions.create({
            line_items: req.body.items.map((item) =>({    
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:item.name,
                        images:[item.images]
                    },
                    unit_amount:item.price * 100
                } ,
                quantity: item.quantity,
                // name: item.name,          
                // price: '{{PRICE_ID}}',
                // quantity: 1,
              })),
            mode:"payment",
            success_url:"https://store-checkout.onrender.com/success.html",
            cancel_url:"https://store-checkout.onrender.com/cancel.html"
        })
        console.log(session.id)
        res.status(200).json(session.id);
       // res.redirect(303, session.url);
    } catch(error){
        next(error)
    }
 });


app.get("/prices", async(req,res, next)=>{
    const prices = await stripe.prices.list({
        limit: 3,
      });
      res.status(200).json(prices);
})

app.get("/products", async(req,res, next)=>{
    const prices = await stripe.products.list({
        limit: 3,
      });
      res.status(200).json(prices);
})

// const price = await stripe.prices.create({
//     unit_amount: 2000,
//     currency: 'usd',
//     recurring: {interval: 'month'},
//     product: 'prod_OK0FICQZGMnj9t',
//   });
const PORT = process.env.PORT || 4242;
 app.listen(PORT,() => console.log("app is running on 4242"));