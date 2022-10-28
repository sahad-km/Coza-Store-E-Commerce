const addToCartView = async (req, res) => {
    const proId = req.params.id;
    let variant = req.body.variant;
    let productId = new mongoose.Types.ObjectId(proId);
    let userId = req.session.userId;
    const cart = await Cart.findOne({ userId });
    if (cart) {
        //cart exists for user
        let productExist = await Cart.findOne({ $and: [{ userId }, { cartItems: { $elemMatch: { productId } } }] });
        if (productExist) {
            //product exists in the cart, update the quantity
            await Cart.findOneAndUpdate({ $and: [{ userId }, { "cartItems.productId": productId }] }, { $inc: { "cartItems.$.quantity": 1 } });
        } else {
            //product does not exists in cart, add new item
            await Cart.updateOne({ userId }, { $push: { cartItems: { productId, quantity: 1 } } });
        }
        req.flash('success', 'Item added Successfully');
    } else {
        //no cart for user, create new cart
        const cart = new Cart({
            userId,
            cartItems: [{ productId, quantity: 1, variant }]
        });
        req.flash('success', 'Item added Successfully');
        try {
            await cart.save();
        } catch (err) {
            const msg = 'Cart adding failed';
            req.flash('error', 'Item adding failed');
            res.send({ msg });
        }
    }
}



///////////////////////////////////////////////////////////////////////
<div class="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
    <div class="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
        <h4 class="mtext-109 cl2 p-b-30">
            Cart Totals
        </h4>

        <div class="flex-w flex-t bor12 p-b-13">
            <div class="size-208">
                <span class="stext-110 cl2">
                    Subtotal:
                </span>
            </div>

            <div class="size-209">
                <span class="mtext-110 cl2">
                    $79.65
                </span>
            </div>
        </div>

        <div class="flex-w flex-t bor12 p-t-15 p-b-30">
            <div class="size-208 w-full-ssm">
                <span class="stext-110 cl2">
                    Shipping:
                </span>
            </div>

            <div class="size-209 p-r-18 p-r-0-sm w-full-ssm">
                <p class="stext-111 cl6 p-t-2">
                    There are no shipping methods available. Please double check your address, or
                    contact us if you need any help.
                </p>

                <div class="p-t-15">
                    <span class="stext-112 cl8">
                        Calculate Shipping
                    </span>

                    <div class="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9">
                        <select class="js-select2" name="time">
                            <option>Select a country...</option>
                            <option>USA</option>
                            <option>UK</option>
                        </select>
                        <div class="dropDownSelect2"></div>
                    </div>

                    <div class="bor8 bg0 m-b-12">
                        {/* <input class="stext-111 cl8 plh3 size-111 p-lr-15" type="text" name="state" */}
                        {/* placeholder="State /  country"> */}
                    </div>

                    <div class="bor8 bg0 m-b-22">
                        {/* <input class="stext-111 cl8 plh3 size-111 p-lr-15" type="text" name="postcode" */}
                        {/* placeholder="Postcode / Zip"> */}
                    </div>

                    <div class="flex-w">
                        <div
                            class="flex-c-m stext-101 cl2 size-115 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer">
                            Update Totals
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="flex-w flex-t p-t-27 p-b-33">
            <div class="size-208">
                <span class="mtext-101 cl2">
                    Total:
                </span>
            </div>

            <div class="size-209 p-t-1">
                <span class="mtext-110 cl2">
                    $79.65
                </span>
            </div>
        </div>

        <button class="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer">
            Proceed to Checkout
        </button>
    </div>
</div>







/////////////////////////////////////////////////////////////////////////





const addtoCart = async (req, res) => {
    if (req.session.user) {
        let { productId } = req.body;
        productId = new mongoose.Types.ObjectId(productId);
        let userId = req.session.user.userId;
        let userExist = await cartModel.findOne({ userId });
        if (userExist) {
            let productExist = await cartModel.findOne({ $and: [{ userId }, { cartItems: { $elemMatch: { productId } } }] });
            if (productExist) {
                //await cartModel.aggregate([{$match:{$and:[{userId},{"cartItems.productId":productId}]}},{$inc:{"cartItems.$.productQuantity":1}}]);
                await cartModel.findOneAndUpdate({ $and: [{ userId }, { "cartItems.productId": productId }] }, { $inc: { "cartItems.$.productQuantity": 1 } });
            } else {
                await cartModel.updateOne({ userId }, { $push: { cartItems: { productId, productQuantity: 1 } } });
            }
        } else {
            let cart = new cartModel({
                userId, cartItems: [{ productId, productQuantity: 1 }]
            });
            try {
                await cart.save();
            } catch (err) {
                const msg = 'cart adding failed';
                res.send({ msg });
            }
        }
        let cartCount = await cartModel.aggregate([{ $match: { userId } }, { $project: { count: { $size: "$cartItems" } } }]);
        res.send({ cartCount });
    } else {
        const msg = 'please login to continue';
        res.send({ msg });
        return;
    }
}
const lessFromCart = async (req, res) => {
    if (req.session.user) {
        let { productId } = req.body;
        productId = new mongoose.Types.ObjectId(productId);
        let userId = req.session.user.userId;
        let userExist = await cartModel.findOne({ userId });
        if (userExist) {
            let productExist = await cartModel.findOne({ $and: [{ userId }, { cartItems: { $elemMatch: { productId } } }] });
            if (productExist) {
                await cartModel.findOneAndUpdate({ $and: [{ userId }, { "cartItems.productId": productId }] }, { $inc: { "cartItems.$.productQuantity": -1 } });
            } else {
                await cartModel.updateOne({ userId }, { $push: { cartItems: { productId, productQuantity: 1 } } });
            }
        } else {
            const msg = 'Item failed to find';
            res.send({ msg });
            return;
        }
        let cartCount = await cartModel.aggregate([{ $match: { userId } }, { $project: { count: { $size: "$cartItems" } } }]);
        res.send({ cartCount });
    } else {
        const msg = 'please login to continue';
        res.send({ msg });
        return;
    }
}

cartList = await cartModel.aggregate([{ $match: { userId } }, { $unwind: '$cartItems' },
{ $project: { item: '$cartItems.productId', itemQuantity: '$cartItems.productQuantity' } },
{ $lookup: { from: process.env.PRODUCT_COLLECTION, localField: 'item', foreignField: '_id', as: 'product' } }]);




<script>
    function changeQuantity(cartId,proId,count){
        $.ajax({
            url: '/change-product-qt',
            data: {
                cart: cartId,
                product: proId,
                count: count
            },
            method: 'post',
            success: (result) =>
                alert(result)
        })
    }
</script>

//     / /--------------------------------------------------------/ /
// script
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
//   <script>
//       let form = document.querySelector('#form')
//       form.addEventListener("submit", (e)=> {
//         e.preventDefault();
//           const paymentStatus =form.elements.paymentStatus.value;
//           const  name = form.elements.name.value;
//           const email = form.elements.email.value;
//           const mobile = form.elements.mobile.value;
//           const address_line =  form.elements.address_line.value;
//           const cart_id = form.elements.cart_id.value;
//           const bill = form.elements.bill.value;
//             fetch('/checkout/order', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({paymentStatus,name,email,mobile,address_line,cart_id,bill})
//             }).then(res=> res.json()).then((data)=>{
//                 // console.log(data.cod)
//                 if(data.cod == true){
//                     window.location.href='/'
//                 }
//                 else{
//                     razerpayFunction(data.options, data.userDetails, data.orderId)
//                 }
//             })
//             // }).then(res => res.json()).then(data => {
//             //     let productDetails = data.product;


//         });
//         function razerpayFunction(payDetails, userDetails, orderId) {

//             let options = {
//             "key": "rzp_test_n8fwEdcfpjW6SY",
//         "amount": payDetails.amount,
//         "currency": "INR",
//         "name": "MyStore",
//         "description": "MyStore Payment",
//         "image": "http://localhost:3000/user/img/logo.png",
//         "order_id": orderId,
//         "handler": function (response) {
//             paymentSuccess(response, payDetails, userDetails, orderId);
//                 },
//         "prefill": {
//             "name": userDetails.fullName,
//         "email": userDetails.email,
//         "contact": userDetails.mobile
//                 },
//         "notes": {
//             "address": userDetails.address
//                 },
//         "theme": {
//             "color": "#3399cc"
//                 }
//             };
//         let rzp1 = new Razorpay(options);
//         rzp1.on('payment.failed', function (response) {
//             window.location = '/gp/checkout/paymentFail';
//             });
//         rzp1.open();
//         e.preventDefault();
//         }
//     </script>


//----------------------------------------------------------------------------//


const placeOrder =async (req,res)=>{

   
    const {bill, paymentStatus,cart_id} =req.body
    const userId = req.session.user_id;
    const status = req.body.paymentStatus==='cod'?true:false
     const cart = await Cart.findById(cart_id)
     console.log('evide pooyi nee',cart);
     const address = {name:req.body.name,email:req.body.email,mobile:req.body.mobile,address_line:req.body.address_line}
    // const address:
    //   console.log(address) 
    const checkout = new Checkout({
        user_id:userId,
          cart_item: cart.cart_item,
          address,
          paymentStatus,
          bill,
          orderStatus: [{
            date: Date.now(),
            isCompleted:status
          }],
    });
    let insertId = checkout._id
    await checkout.save()
        if(paymentStatus==='cod'){
            const cod = true;
            res.send({cod})
        }
        else{
            // const order= checkout._id
            // const total = b
        const user = await User.findById(userId);
        const fullName = user.firstName+''+user.lastName
       const mobile =  user.mobile
       const email = user.email
       const options = {
        amount: checkout.bill*100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + insertId
    };
            instance.orders.create( options,function (err, order) {
                const orderId = order.id;
               
                const userDetails = {
                    fullName,
                    mobile,
                    email,
                };
                res.send({
                    options,
                    userDetails,
                    orderId
                });
    
            console.log(order)   
     
    })
}
}






//--------------------------------------------------------------//

<!-- <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Success</title>
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="/checkout/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

<style>
    /* .gradient-custom {
background: rgb(11, 3, 17);
background: -webkit-linear-gradient(to top left, rgb(11, 3, 17), rgba(246, 243, 255, 1));
background: linear-gradient(to top left, rgb(11, 3, 17), rgba(246, 243, 255, 1))
} */
</style>
</head>
<body>
    <section class="h-100 gradient-custom" >
        <div class="container py-5 h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-10 col-xl-8">
              <div class="card" style="border-radius: 10px; padding: 1em; ">
                <div class="card-header px-4 py-5">
                  <h2 class="text-muted mb-0">Thanks for your Order, <span style="color: #996b8d;">Anna</span>!</h5>
                </div>
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <p class="lead fw-normal mb-0" style="color: #222;;">Receipt</p>
                    <p class="small text-muted mb-0">Receipt Voucher : 1KAU9-84UIL</p>
                  </div>
                  <div class="card shadow-0 border mb-4">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-2">
                          <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/13.webp"
                            class="img-fluid" alt="Phone">
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0">Samsung Galaxy</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0 small">White</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0 small">Capacity: 64GB</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0 small">Qty: 1</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0 small">$499</p>
                        </div>
                      </div>
                      <hr class="mb-4" style="background-color: #e0e0e0; opacity: 1;">
                      
                      </div>
                    </div>
                  </div>
                  <div class="card shadow-0 border mb-4">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-2">
                          <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/1.webp"
                            class="img-fluid" alt="Phone">
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0">iPad</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0 small">Pink rose</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0 small">Capacity: 32GB</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0 small">Qty: 1</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text-muted mb-0 small">$399</p>
                        </div>
                      </div>
                      <hr class="mb-4" style="background-color: #e0e0e0; opacity: 1;">
                      <div class="row d-flex align-items-center">
                        <div class="col-md-2">
                          <p class="text-muted mb-0 small">Track Order</p>
                        </div>
                        <div class="col-md-10">
                          <div class="progress" style="height: 6px; border-radius: 16px;">
                            <div class="progress-bar" role="progressbar"
                              style="width: 20%; border-radius: 16px; background-color: #222;;" aria-valuenow="20"
                              aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                          <div class="d-flex justify-content-around mb-1">
                            <p class="text-muted mt-1 mb-0 small ms-xl-5">Out for delivary</p>
                            <p class="text-muted mt-1 mb-0 small ms-xl-5">Delivered</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  <div class="d-flex justify-content-between pt-2">
                    <p class="fw-bold mb-0">Order Details</p>
                    <p class="text-muted mb-0"><span class="fw-bold me-4">Total</span> $898.00</p>
                  </div>
      
                  <div class="d-flex justify-content-between pt-2">
                    <p class="text-muted mb-0">Invoice Number : 788152</p>
                    <p class="text-muted mb-0"><span class="fw-bold me-4">Discount</span> $19.00</p>
                  </div>
      
                  <div class="d-flex justify-content-between">
                    <p class="text-muted mb-0">Invoice Date : 22 Dec,2019</p>
                    <p class="text-muted mb-0"><span class="fw-bold me-4">GST 18%</span> 123</p>
                  </div>
      
                  <div class="d-flex justify-content-between mb-5">
                    <p class="text-muted mb-0">Recepits Voucher : 18KU-62IIK</p>
                    <p class="text-muted mb-0"><span class="fw-bold me-4">Delivery Charges</span> Free</p>
                  </div>
                </div>
                <div class="card-footer border-0 px-4 py-5"
                  style="background-color: #222;; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                  <h5 class="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">Total
                    paid: <span class="h2 mb-0 ms-2">$1040</span></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
        crossorigin="anonymous"></script>
</body>
</html> --></link>


