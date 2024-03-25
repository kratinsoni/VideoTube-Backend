import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) {
    return new ApiError(400, "content is Required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  if (!tweet) {
    return new ApiError(500, "Something Went Wrong while");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Created Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return new ApiError(400, "Invalid User Id");
  }

  const tweets = await Tweet.find({ owner: userId });

  if (!tweets) {
    return new ApiError(500, "No Tweets exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { newContent } = req.body;
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    return new ApiError(400, "Tweet Does Not Exist");
  }

  if (!newContent) {
    return new ApiError(400, "Content is Required");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content: newContent },
    {
      new: true,
    }
  );

  if (!updatedTweet) {
    return new ApiError(500, "Something went wrong while updating tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!isValidObjectId) {
    return new ApiError(400, "Tweet does not exist");
  }

  await Tweet.deleteOne({ _id: tweetId });

  return res
    .status(200)
    .json(new ApiResponse(200, "tweet Deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
