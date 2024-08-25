// import purchaseModel from "../models/purchaseModel.js";
// import serviceModel from "../models/serviceModel.js";
// import userModel from "../models/userModel.js";
// import categoryModel from "../models/catagorieModel.js";

// export const getTotals = async (req, res, next) => {
//   try {
//     // Get the start and end dates of the current and previous month
//     const now = new Date();
//     const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfCurrentMonth = new Date(
//       now.getFullYear(),
//       now.getMonth() + 1,
//       0
//     );

//     const startOfPreviousMonth = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       1
//     );
//     const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

//     // Helper function to get total value for a given date range
//     const getTotal = async (model, dateField, startDate, endDate, field) => {
//       const result = await model.aggregate([
//         {
//           $match: {
//             [dateField]: {
//               $gte: startDate,
//               $lt: endDate,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             total: { $sum: `$${field}` },
//           },
//         },
//       ]);
//       return result[0]?.total || 0;
//     };

//     // Get current month totals
//     const totalMonthSalary = await getTotal(
//       purchaseModel,
//       "createdAt",
//       startOfCurrentMonth,
//       endOfCurrentMonth,
//       "totalPrice"
//     );
//     const totalProduct = await serviceModel.countDocuments();
//     const totalPurchased = await purchaseModel.countDocuments();
//     const totalCustomer = await userModel.countDocuments();

//     // Get previous month totals
//     const currentMonthSalary = await getTotal(
//       purchaseModel,
//       "createdAt",
//       startOfCurrentMonth,
//       endOfCurrentMonth,
//       "totalPrice"
//     );
//     const previousMonthSalary = await getTotal(
//       purchaseModel,
//       "createdAt",
//       startOfPreviousMonth,
//       endOfPreviousMonth,
//       "totalPrice"
//     );

//     const currentProduct = await serviceModel.countDocuments({
//       createdAt: {
//         $gte: startOfCurrentMonth,
//         $lt: endOfCurrentMonth,
//       },
//     });
//     const previousProduct = await serviceModel.countDocuments({
//       createdAt: {
//         $gte: startOfPreviousMonth,
//         $lt: endOfPreviousMonth,
//       },
//     });

//     const currentPurchased = await purchaseModel.countDocuments({
//       createdAt: {
//         $gte: startOfCurrentMonth,
//         $lt: endOfCurrentMonth,
//       },
//     });
//     const previousPurchased = await purchaseModel.countDocuments({
//       createdAt: {
//         $gte: startOfPreviousMonth,
//         $lt: endOfPreviousMonth,
//       },
//     });

//     const currentCustomer = await userModel.countDocuments({
//       createdAt: {
//         $gte: startOfCurrentMonth,
//         $lt: endOfCurrentMonth,
//       },
//     });
//     const previousCustomer = await userModel.countDocuments({
//       createdAt: {
//         $gte: startOfPreviousMonth,
//         $lt: endOfPreviousMonth,
//       },
//     });

//     // Calculate percentage increases
//     const salaryIncrease =
//       currentMonthSalary && previousMonthSalary
//         ? ((currentMonthSalary / previousMonthSalary) - 1) *
//           100
//         : 0;

//     const productIncrease =
//       currentProduct && previousProduct
//         ? (currentProduct / previousProduct - 1) * 100
//         : 0;

//     const purchasedIncrease =
//       currentPurchased && previousPurchased
//         ? ((currentPurchased / previousPurchased) - 1) * 100
//         : 0;

//     const customerIncrease =
//       currentCustomer && previousCustomer
//         ? ((currentCustomer / previousCustomer) - 1) * 100
//         : 0;

//     res.status(200).json({
//       totalMonthSalary,
//       totalCustomer,
//       totalProduct,
//       totalPurchased,
//       salaryIncrease,
//       productIncrease,
//       purchasedIncrease,
//       customerIncrease,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getCategorySalesDistribution = async (req, res, next) => {
//   try {
//     // Fetch all categories
//     const categories = await categoryModel.find();

//     // Fetch total prices by category
//     const totalPriceByCategory = await purchaseModel.aggregate([
//       {
//         $group: {
//           _id: "$category", // Group by category name
//           totalPrice: { $sum: "$totalPrice" }, // Sum up total price for each category
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           category: "$_id", // Rename _id to category
//           totalPrice: "$totalPrice",
//         },
//       },
//     ]);

    
//     // Create a mapping of category names to their total prices
//     const priceMap = totalPriceByCategory.reduce((map, item) => {
//         map[item.category] = item.totalPrice;
//         return map;
//     }, {});
    
//     // Combine categories with their total prices
//     const categorySalesDistribution = categories.map((category) => ({
//       category: category.title,
//       totalSales: priceMap[category.title] || 0,
//     }));

//     res.status(200).json(categorySalesDistribution);
//   } catch (error) {
//     next(error);
//   }
// };

// export const topUsers = async(req, res, next) => {
//   try {
//     const topusers = await userModel
//       .find()
//       .sort({ total_price: -1 })
//       .limit(5)
//       // const sortedTopUsers = topusers.sort(
//       //   (a, b) => b.total_price - a.total_price
//       // );
//     res.status(200).json(topusers);
//   } catch (error) {
//     next(error)
//   }
// }

// export const topPendingOrders = async (req, res, next) => {
//   try {

//     const pendingOrders = await purchaseModel
//       .find({ status: "Pending" })
//       .sort({ createdAt: -1 })
//       .limit(5);


//     const pendingOrdersWithUser = await Promise.all(
//       pendingOrders.map(async (order) => {
//         const user = await userModel.findById(order.userId).exec();
//         return {
//           ...order._doc,
//           user: user ? user : null, 
//         };
//       })
//     );

//     res.status(200).json(pendingOrdersWithUser);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getSalesAndRevenue = async (req, res, next) => {
//   try {
//     const now = new Date();
//     const currentYear = now.getFullYear();
//     const currentMonth = now.getMonth() + 1; // Months are 0-indexed in JavaScript
//      await purchaseModel.updateMany(
//        {},
//        { $set: { price: 50 } } // Initialize price field to null
//      );
//     const salesData = await purchaseModel.aggregate([
//       {
//         $match: {
//           $expr: {
//             $and: [
//               { $eq: [{ $year: "$createdAt" }, currentYear] },
//               { $eq: [{ $month: "$createdAt" }, currentMonth] },
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             day: { $dayOfMonth: "$createdAt" },
//           },
//           totalSales: { $sum: "$quantity" },
//           totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
//         },
//       },
//       {
//         $sort: { "_id.day": 1 }, // Sort by day in ascending order
//       },
//       {
//         $project: {
//           _id: 0, // Exclude the _id field
//           day: "$_id.day",
//           totalSales: 1,
//           totalRevenue: 1,
//         },
//       },
//     ]);

//     // Format the data for the line chart
//     const formattedData = salesData.map((dayData) => ({
//       date: `${currentYear}-${currentMonth}-${dayData.day}`,
//       totalSales: dayData.totalSales,
//       totalRevenue: dayData.totalRevenue,
//     }));

//     res.status(200).json(formattedData);
//   } catch (error) {
//     next(error);
//   }
// };