import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");

  //const {userProfile, user} = useSelector((store) => store.auth);
  //const user = useSelector(store => store.auth.user);
  const userProfile = useSelector(store => store.auth);
  //const user = useSelector((store) => store.auth);
  console.log(userProfile);
  //console.log(user)
  //console.log(userProfile?.user?.profilePicture);

  const isLoggedInUserProfile =true // user?._id === userProfile?.user?._id;
  // console.log(user?._id);
  // console.log(userProfile?.user?._id);
  const isfollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // const displayedPost = activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  //const displayedPost = activeTab === "posts" ? userProfile?.user?.posts : userProfile?.user?.bookmarks;
  const displayedPost = activeTab === "posts" ? userProfile?.user?.posts || [] : userProfile?.user?.bookmarks || [];

  console.log(userProfile);

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.user?.profilePicture} alt="Profile Picture" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.user?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">
                        Edit Profile
                      </Button>
                    </Link>

                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      View archive
                    </Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      Ad tools
                    </Button>
                  </>
                ) : isfollowing ? (
                  <>
                    <Button variant="secondary" className="hover:bg-[#3192d2] h-8">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="hover:bg-[#3192d2] h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" className="bg-[#0095F6] hover:bg-[#3192d2] h-8">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <p>
                  <span className="font-semibold mr-1">{userProfile.user.posts.length}</span>Posts
                </p>
                <p>
                  <span className="font-semibold mr-1">{userProfile.user.followers.length}</span>Followers
                </p>
                <p>
                  <span className="font-semibold mr-1">{userProfile.user.following.length}</span>Following
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userProfile?.bio || "Bio here....."}</span>
                <Badge className="w-fit" variant="secondary ">
                  <AtSign />
                  <span className="pl-1"> {userProfile.user.username}</span>
                </Badge>
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime </span>
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime </span>
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime </span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span className={`py-3 cursor-pointer ${activeTab === "post" ? "font-bold" : ""}`} onClick={() => handleTabChange("post")}>
              {" "}
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === "saved" ? "font-bold" : ""}`} onClick={() => handleTabChange("saved")}>
              {" "}
              SAVED
            </span>
            <span className="py-3 cursor-pointer"> REELS</span>
            <span className="py-3 cursor-pointer"> TAGS</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {displayedPost.map((post) => (
            <div key={post?._id} className="relative group cursor-pointer">
              <img src={post?.image} alt="post_image" className="rounded-sm my-2 w-full aspect-square object-cover" />
              <div className=" absolute rounded inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center text-white space-x-4">
                  <button className="flex items-center gap-2 hover:text-gray-300">
                    <Heart />
                    <span>{post?.likes.length}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-gray-300">
                    <MessageCircle />
                    <span>{post?.comments.length}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* {displayedPost.map((post) => (
            <div key={post?._id} className="relative group cursor-pointer">
              <img src={post?.image} alt="post_image" className="rounded" />
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
