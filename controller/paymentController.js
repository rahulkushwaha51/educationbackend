const catchAsyncError = require("../middlewares/catchAsyncError");
const paymentModel = require("../models/paymentModel");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utility/errorHandler");
const { instance } = require("../utility/instance");
const crypto = require("crypto");

// subscription
module.exports.buySubscription = catchAsyncError(async function buySubscription(
  req,
  res,
  next
) {
  const user = await userModel.findById(req.user._id);
  if (user.role === "admin") {
    return next(new ErrorHandler("Admin can't buy subscription", 400));
  }
  const plan_id = process.env.PLAN_ID || "plan_NEjOQnnug5LKgf";
  const subscription = await instance.subscriptions.create({
    plan_id,
    total_count: 12,
    customer_notify: 1,
  });
  if (!user.subscription) {
    user.subscription = {};
  }
  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;
  await user.save();
  res.status(201).json({
    success: true,
    subscriptionId:subscription.id,
  });
});

// payment
module.exports.paymentVerification = catchAsyncError(
  async function paymentVerification(req, res, next) {
    const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } =
      req.body;
    const user = await userModel.findById(req.user._id);
    const subscription_id = user.subscription.id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZ_SECRET)
      .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
      .digest("hex");
    const isAuthentic = generated_signature === razorpay_signature;
    if (!isAuthentic)
      return res.redirect(`${process.env.FRONTEND_URL}/paymentfailed`);
    // database comes here
    await paymentModel.create({
      razorpay_signature,
      razorpay_payment_id,
      razorpay_subscription_id,
    });
    user.subscription.status = "active";
   await user.save();
    res.redirect(
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  }
);
// razorpay key
module.exports.getRazorpayKey = catchAsyncError(async function getRazorpayKey(
  req,
  res,
  next
) {
  res.status(200).json({
    success: true,
    key: process.env.RAZ_KEY,
  });
});

module.exports.cancelSubscription = catchAsyncError(
  async function getRazorcancelSubscriptionpayKey(req, res, next) {
    const user = await userModel.findById(req.user._id);

    const subscriptionId = user.subscription.id;

    let refund = false;

    await instance.subscriptions.cancel(subscriptionId);

    const payment = await paymentModel.findOne({
      razorpay__subscription_id: subscriptionId,
    });
    const gap = Date.now() - payment.CreatedAt;

    const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

    if (gap < refundTime) {
      await instance.payments.refund(payment.razorpay_payment_id);
      refund = true;
    }
    await paymentModel.findByIdAndDelete(subscriptionId);

    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: refund
        ? "Subscription cancelled,You will recieve full refund within 7 days"
        : "Subscription cancelled ,No refund initiated as you cancelled after 7 days. ",
    });
  }
);
