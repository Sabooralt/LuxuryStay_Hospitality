const Service = require("../models/serviceModel");
const ServiceOrder = require("../models/serviceOrderModel");
const Booking = require("../models/bookingModel");

const OrderService = async (req, res) => {
  try {
    const { bookingId, serviceIds, quantities } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    let totalServiceCost = 0;
    const serviceOrders = [];

    for (let i = 0; i < serviceIds.length; i++) {
      const service = await Service.findById(serviceIds[i]);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: `Service with ID ${serviceIds[i]} not found`,
        });
      }

      const cost = service.price * (quantities[i] || 1);
      totalServiceCost += cost;

      const serviceOrder = new ServiceOrder({
        booking: bookingId,
        service: serviceIds[i],
        quantity: quantities[i] || 1,
        cost,
      });

      await serviceOrder.save();
      serviceOrders.push(serviceOrder._id);
    }

    booking.serviceOrders.push(...serviceOrders);
    booking.serviceCost += totalServiceCost;
    booking.totalCost += totalServiceCost;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Services ordered successfully",
      booking,
    });
  } catch (error) {
    console.error("Error ordering services:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

module.exports = { OrderService };
