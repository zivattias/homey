import React from "react";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";

function ProfilePage() {
  const user = useUser();

  return !user.accessToken ? (
    <Navigate to="/" />
  ) : (
    <>
      <div>ProfilePage</div>
      <p>Hello</p>
    </>
  );
}

export default ProfilePage;
