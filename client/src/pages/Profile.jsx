import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `https://eliteestate.onrender.com/api/v1/user/update/${currentUser._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileUploadError(true);
      },
      () => {
        setFileUploadError(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `https://eliteestate.onrender.com/api/v1/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(
        "https://eliteestate.onrender.com/api/v1/auth/signout",
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `https://eliteestate.onrender.com/api/v1/user/listings/${currentUser._id}`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
      console.log(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `https://eliteestate.onrender.com/api/v1/listing/delete/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          src={formData.avatar || currentUser.avatar}
          alt="avatar"
          className="self-center rounded-full h-24 w-24 object-cover cursor-pointer"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg w-full"
          onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg w-full"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg w-full"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex gap-2 mt-3 justify-between">
        <Link to="/signup">
          <span onClick={handleDeleteUser} className="text-red-700">
            Delete Account
          </span>
        </Link>
        <Link to="/signin">
          <span onClick={handleSignOut} className="text-red-700">
            Sign Out
          </span>
        </Link>
      </div>
      {error && !updateSuccess && <p className="text-red-500 mt-5">{error}</p>}
      <p className="text-green-700 mt-3">
        {updateSuccess && !error ? "User is updated successfully!" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 text-center w-full"
      >
        Show Listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
