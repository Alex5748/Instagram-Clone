import React, { useEffect, useState } from "react";
import { DialogContent, Dialog, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { VscSend } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // This makes sure the cookies (including the token) are sent with the request
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response.data.comment);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w 5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="comment_man"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibld text-xs">
                    {selectedPost?.author?.username}
                  </Link>
                  {/* <span className="text-gray-600 text-sm">Bio here....</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full ">
                    Add to favourites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1 ">
                <input
                  value={text}
                  onChange={changeEventHandler}
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full outline-none border border-gray-300   rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="transparent"
                >
                  <VscSend />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
