import { useMatch, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUsersQuery } from "../queries/usersQueries.js";

const User = ({ user }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cachedUsers = queryClient.getQueryData(["users"]);

  const match = useMatch("/users/:id");
  const { data, isLoading, isError } = useUsersQuery();
  if (!user) {
    return null;
  }
  const users = cachedUsers ? cachedUsers : isLoading || isError ? null : data;
  if (!users) {
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return <h3>Error loading users data.</h3>;
    }
  }

  if (!users) {
    return <div>No users data available.</div>;
  }
  const targetUser = users.find((u) => u.id === match?.params.id);

  if (!targetUser) {
    return <div>User not found in server.</div>;
  }

  return (
    <>
      <h2>{targetUser.name}</h2>
      <h3>Added blogs:</h3>
      <ul>
        {targetUser.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
      <button onClick={() => navigate("/users")}>Go back</button>
    </>
  );
};

export default User;
