import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="client">
      <div>
        <Avatar name={username} size={50} round="14px" />
        <span>{username}</span>
      </div>
      <span>В сети</span>
    </div>
  );
};

export default Client;
