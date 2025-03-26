import { useEffect, useState } from "react";
import usersService from "../services/users.js";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const allUsers = await usersService.getAll();
    setUsers(allUsers);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <h2>So many users!</h2>
      <p>{users && users.length}</p>
    </>
  );
};
export default Users;
