import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  let like;

  if (await Like.find({ video: videoId })) {
    await Like.delete({ video: videoId });
  } else {
    like = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
  }

  if (!like) {
    throw new ApiError(500, "Something went wrong while creating like");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, like, "Like Toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  let like;

  if (await Like.find({ comment: commentId })) {
    await Like.delete({ comment: commentId });
  } else {
    like = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
  }

  if (!like) {
    throw new ApiError(500, "Something went wrong while creating like");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, like, "Like Toggled successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  let like;

  if (await Like.find({ tweet: tweetId })) {
    await Like.delete({ tweet: tweetId });
  } else {
    like = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });
  }

  if (!like) {
    throw new ApiError(500, "Something went wrong while creating like");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, like, "Like Toggled successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const videos = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true },
  });

  if (!videos) {
    throw new ApiError(400, "No Liked videos found");
  }

  return res
    .status(200)
    .json(
      200,
      { numOfVideos: videos.length, videos },
      "Liked videos Fetched Successfully"
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
