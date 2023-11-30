import Listing from "../mongodb/models/listing.model.js";

export const testList = (req, res) => {
  res.send("Hello from Listing  of Elite Estate!");
};

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
