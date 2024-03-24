import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // if (!isValidObjectId(channelId)) {
  //   throw new ApiError(404, "Channel not found");
  // }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribers",
      },
    },
    {
      $project: {
        _id: 1,
        channel: 1,
        subscriber: 1,
        createdAt: 1,
        updatedAt: 1,
        subscribers: {
          $arrayElemAt: ["$subscribers", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        subscribers: {
          username: 1,
          avatar: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!subscribers) {
    throw new ApiError(404, "The channel does not exist");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfSubscribers: subscribers.length,
        subscribers,
      },
      "Creating a function to get a channel's subscriber"
    )
  );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Subscriber does not exist");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "channels",
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        channels: {
          $arrayElemAt: ["$channels", 0],
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        channels: {
          username: 1,
          avatar: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!channels) {
    throw new ApiError(404, "The subscriber does not exist");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfChannelsSubscribedTo: channels.length,
        channels,
      },
      "Successfully fetched the number of channels user is subscribed to"
    )
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
