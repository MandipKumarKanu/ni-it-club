import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Table, { TableRow, TableCell } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import toast from "react-hot-toast";
import Skeleton from "../../components/ui/Skeleton";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Link to="/users/new">
          <Button className="flex items-center gap-2">
            <FaPlus size={16} /> Add User
          </Button>
        </Link>
      </div>

      {loading ? (
        <Table headers={["Name", "Email", "Role", "Designation", "Actions"]}>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-6 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : users.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No users found</p>
        </div>
      ) : (
        <Table headers={["Name", "Email", "Role", "Designation", "Actions"]}>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-bold">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span
                  className={`${
                    user.role === "admin"
                      ? "bg-purple-200 text-purple-600"
                      : "bg-green-200 text-green-600"
                  } py-1 px-3 rounded-full text-xs font-bold border border-black`}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell>{user.designation}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link to={`/users/${user._id}`}>
                    <Button variant="outline" className="p-2">
                      <FaEdit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user._id)}
                    className="p-2"
                  >
                    <FaTrash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </div>
  );
};

export default UsersList;
