import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  // validate video Id by checking if video exists or not
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  // get user who liked
  const user = req.user._id;

  if (!user) {
    throw new ApiError(404, "The user who liked or unliked does not exist");
  }

  let like, unlike;

  const isLiked = await Like.findOne({
    video: videoId,
    likedBy: user._id,
  });

  // video already has a like -> unlike
  if (isLiked) {
    unlike = await Like.deleteOne({
      video: videoId,
    });

    if (!unlike) {
      throw new ApiError(500, "Something went wrong while unliking the video");
    }
  } else {
    // if not liked -> like
    like = await Like.create({
      video: videoId,
      likedBy: user._id,
    });

    if (!like) {
      throw new ApiError(500, "Something went wrong while liking the video");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, like || unlike, "Toggled Video like successfully")
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  // validate comment Id by checking if comment exists or not
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment does not exist");
  }

  // get user who liked
  const user = req.user._id;

  if (!user) {
    throw new ApiError(404, "The user who liked or unliked does not exist");
  }

  let like, unlike;

  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: user._id,
  });

  // comment already has a like -> unlike
  if (isLiked) {
    unlike = await Like.deleteOne({
      comment: commentId,
    });

    if (!unlike) {
      throw new ApiError(
        500,
        "Something went wrong while unliking the comment"
      );
    }
  } else {
    // if not liked -> like
    like = await Like.create({
      comment: commentId,
      likedBy: user._id,
    });

    if (!like) {
      throw new ApiError(500, "Something went wrong while liking the comment");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, like || unlike, "Toggled comment like successfully")
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  // validate tweet Id by checking if tweet exists or not
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "tweet does not exist");
  }

  // get user who liked
  const user = req.user._id;

  if (!user) {
    throw new ApiError(404, "The user who liked or unliked does not exist");
  }

  let like, unlike;

  const isLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: user._id,
  });

  // tweet already has a like -> unlike
  if (isLiked) {
    unlike = await Like.deleteOne({
      tweet: tweetId,
    });

    if (!unlike) {
      throw new ApiError(500, "Something went wrong while unliking the tweet");
    }
  } else {
    // if not liked -> like
    like = await Like.create({
      tweet: tweetId,
      likedBy: user._id,
    });

    if (!like) {
      throw new ApiError(500, "Something went wrong while liking the tweet");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, like || unlike, "Toggled tweet like successfully")
    );
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
      new ApiResponse(
        200,
        { numOfVideos: videos.length, videos },
        "Liked videos Fetched Successfully"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
