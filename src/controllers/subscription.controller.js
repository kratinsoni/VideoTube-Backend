import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "channel does not exist");
  }

  let subscribe, unSubscribe;

  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (!isSubscribed) {
    subscribe = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });

    if (!subscribe) {
      throw new ApiError(500, "Something went wrong while Subscribing User");
    }
  } else {
    unSubscribe = await Subscription.deleteOne({
      channel: channelId,
      subscriber: req.user._id,
    });

    if (!unSubscribe) {
      throw new ApiError(500, "Something went wrong while unsubscribing ");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribe || unSubscribe,
        "Subscription Toggled SuccessFully"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "Channel not found");
  }

  const channel = await Subscription.aggregate([
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
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribers: channel[0].subscribers,
        numOfSubscribers: channel[0].subscribers.length,
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

  const subscriber = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "channelsSubscribedTo",
      },
    },
  ]);

  if (!subscriber) {
    throw new ApiError(404, "The subscriber does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriber[0].channelsSubscribedTo,
        "Successfully fetched the number of channels user is subscribed to"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
