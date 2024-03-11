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
    throw new ApiError(404, "Channel does not exist");
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel does not exist");
  }

  const userId = req.user._id;
  let subscribe, unsubscribe;

  const userIsSubscribed = await Subscription.find({
    channel: channelId,
    subscriber: userId,
  });

  if (!userIsSubscribed) {
    subscribe = await Subscription.create({
      channel: channelId,
      subscriber: userId,
    });

    if (!subscribe) {
      throw new ApiError(
        500,
        "Something went wrong while subscribing to the channel"
      );
    }
  } else {
    unsubscribe = await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: userId,
    });

    if (!unsubscribe) {
      throw new ApiError(500, "Something went wrong while unsubscribing");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribe || unsubscribe,
        "Subscribed or unSubscribed successfully"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribersList = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscriptions",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "subscriber",
              foreignField: "_id",
              as: "subscribers",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribersList[0].subscriptions,
        "Channel Subscribers fetched successfully"
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
