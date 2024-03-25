import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "Invalid video Id");
  }

  page = Number(page);
  limit = Number(limit);

  if (!Number.isFinite(page)) {
    throw new ApiError(400, "Page is required");
  }

  if (!Number.isFinite(limit)) {
    throw new ApiError(400, "Limit is required");
  }

  const allComments = await Comment.aggregate([
    {
      $match: {
        video: videoId,
      },
    },
  ]);

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(allComments),
    { page, limit }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, comments, "Fetched all the comments on a video")
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { userId } = req.user._id;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  if (!content) {
    throw new ApiError(400, "Content is Required");
  }

  const comment = await Comment.create({
    content,
    owner: userId,
    video: videoId,
  });

  const createdComment = await Comment.findById(comment._id);

  if (!createdComment) {
    throw new ApiError(500, "Something went wrong while creating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { newContent } = req.body;

  // if (!isValidObjectId(commentId)) {
  //   throw new ApiError(400, "Invalid comment Id");
  // }

  if (!newContent) {
    throw new ApiError(400, "Content is Required");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newContent,
      },
    },
    {
      new: true,
    }
  );

  if (!comment) {
    throw new ApiError(400, "failed to update Comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment Updated Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const response = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Comment Deleted SuccessFully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
