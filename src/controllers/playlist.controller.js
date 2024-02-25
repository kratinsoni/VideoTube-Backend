import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist

  if (!name || !description) {
    throw new ApiError(400, "All Fields are Required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(500, "Something went wrong while Creating Playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Created Successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "playlists",
        localField: "_id",
        foreignField: "owner",
        as: "userPlaylists",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].getUserPlaylists,
        "Playlists Fetched SuccessFully"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  const playList = await Playlist.findById(playlistId);

  if (!playList) {
    throw new ApiError(400, "No Such Playlist Exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "No Such playlist exists");
  }

  playlist.videos.push(videoId);

  await playlist.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video Added SuccessFully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  const playlist = await Playlist.findById(playlistId);

  const index = playlist.videos.indexOf(videoId);

  if (index > -1) {
    // only splice array when item is found
    playlist.videos.splice(index, 1); // 2nd parameter means remove one item only
  }

  await playlist.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video successfully removed from playlist")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  await Playlist.deleteOne({ _id: playlistId });

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist deleted Successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!name || !description) {
    throw new ApiError(400, "All Fields are Required");
  }

  const playlist = await Playlist.findByIdandUpdate(
    playlistId,
    {
      name,
      description,
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    throw new ApiError(400, "Something went wrong while updating playlist");
  }

  return res.status(200).json(200, playlist, "Playlist Updated successfully");
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
