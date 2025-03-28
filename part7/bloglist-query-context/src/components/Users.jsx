import { Link } from "react-router-dom";
import {Table} from "react-bootstrap"
import useNotification from "../hooks/useNotification.js";
import { useUsersQuery } from "../queries/usersQueries.js";

const Users = ({ user }) => {
  const { showError } = useNotification();
  const { isLoading, isError, data } = useUsersQuery();
  if (!user) {
    return null;
  }
  if (isError) {
    return <h3>Couldn't load user data.</h3>;
  }
  if (isLoading) {
    return <h3>Loading…</h3>;
  }

  const users = data;

  return (
    <>
      <h2>Users ({users.length})</h2>
      <Table striped>
        <thead>
          <tr>
            <th>Name:</th>
            <th>Blogs created:</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td><b>
                <Link to={`/users/${u.id}`}> {u.name} </Link></b>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
export default Users;
