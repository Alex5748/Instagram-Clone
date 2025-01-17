import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Messages = ({ selectedUser }) => {
  return (
    <div className="flex-1 overflow-y-autop-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar>
            <AvatarImage src={selectedUser?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
        </div>
      </div>
    </div>
  );
};

export default Messages;
