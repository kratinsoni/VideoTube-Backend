import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { userId } = req.user._id;
  const { content } = req.body;

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
    .status(201)
    .json(new ApiResponse(200, createdComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { newContent } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: newContent,
    },
    {
      new: true,
    }
  );

  if (!comment) {
    throw new ApiError(400, "failed to update Comment");
  }

  return res.status(200).json(200, comment, "Comment Updated Successfully");
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const response = await Comment.deleteOne({ _id: commentId });

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Comment Deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
