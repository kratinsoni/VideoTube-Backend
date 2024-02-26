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
        subscribersList[0].Subscriptions[0].subsribers,
        "Channel Subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const channelsSubscribedTo = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "Subscriber",
        as: "channelsSubscribed",
      },
    },
    {
      $project: {
        channelsSubscribed: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      200,
      channelsSubscribedTo[0],
      "Channels subscribed to fetched successfully"
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
