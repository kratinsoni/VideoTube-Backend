import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination

  let {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = 1, // Ascending
    userId,
  } = req.query;

  // Converting string to interger
  page = Number.parseInt(page);
  limit = Number.parseInt(limit);

  // Validation
  if (!Number.isFinite(page)) {
    throw new ApiError(404, "Page number should be integer");
  }

  if (!Number.isFinite(limit)) {
    throw new ApiError(404, "Video limit should be integer");
  }

  if (!query.trim()) {
    throw new ApiError(404, "Query is required");
  }

  // getting user
  const user = await User.findById(userId);

  if (!user._id) {
    throw new ApiError(404, "User not found");
  }

  // getting videos
  const allVideos = await Video.aggregate([
    {
      $match: {
        owner: user._id,
        title: {
          $regex: query.trim(),
          $options: "i",
        },
      },
    },
    {
      $sort: {
        [sortBy]: sortType,
      },
    },
  ]);

  const videos = await Video.aggregatePaginate(Video.aggregate(allVideos), {
    page,
    limit,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfVideos: videos.length,
        videos,
      },
      "Testing get All Videos"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video

  //getting title and descripion
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "title is required");
  }

  if (!description) {
    throw new ApiError(400, "description is required");
  }

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video is Required");
  }

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail is required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "failed to upload video on cloudinary");
  }

  if (!thumbnail) {
    throw new ApiError(400, "failed to upload thumbnail on cloudinary");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
    isPublished: false,
    owner: req.user._id,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(500, "Something Went Wrong While creating the video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "Video Created SuccessFully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video not found");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "No Such Video Exists");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video Fetched SuccessFully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video Not Found");
  }

  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is Required");
  }

  if (!description) {
    throw new ApiError(400, "description is Required");
  }

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  console.log(thumbnailLocalPath);

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail is Required local path");
  }

  const videoThum = await Video.findById(videoId);

  await deleteFromCloudinary(videoThum.thumbnail);

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    throw new ApiError(400, "thumbnail required cloudinary");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(201)
    .json(new ApiResponse(200, video, "video Details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video Not Found");
  }

  const response = await Video.deleteOne({ _id: videoId });

  return res
    .status(201)
    .json(new ApiResponse(200, response, "Video deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video not found");
  }

  const video = await Video.findById(videoId);

  if (!req.user._id.equals(video.owner)) {
    throw new ApiError(400, "You do not have permission to delete this video");
  }

  video.isPublished = !video.isPublished;
  video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "ToggledPublishStatusSuccessfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
