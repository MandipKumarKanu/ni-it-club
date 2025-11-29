import { useState, useEffect } from "react";
import { Eye, Trash2, Mail } from "lucide-react";
import api from "../../services/api";
import Table, { TableRow, TableCell } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ContactDetails from "./ContactDetails";
import toast from "react-hot-toast";
import { format } from "date-fns";

import Loader from "../../components/ui/Loader";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/contact");
      setContacts(data.contacts);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await api.delete(`/contact/${id}`);
        toast.success("Message deleted");
        fetchContacts();
      } catch (error) {
        toast.error("Failed to delete message");
      }
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
    // Mark as read locally if needed, but backend handles it on getById
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
    fetchContacts(); // Refresh to update status
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>

      {loading ? (
        <Loader />
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No messages found</p>
        </div>
      ) : (
        <Table
          headers={["Status", "Date", "Name", "Subject", "Category", "Actions"]}
        >
          {contacts.map((contact) => (
            <TableRow
              key={contact._id}
              className={contact.status === "new" ? "bg-yellow-50" : ""}
            >
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-bold border border-black ${
                    contact.status === "new"
                      ? "bg-ni-neon"
                      : contact.status === "replied"
                      ? "bg-ni-cyan text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {contact.status.toUpperCase()}
                </span>
              </TableCell>
              <TableCell>
                {format(new Date(contact.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="font-bold">{contact.name}</TableCell>
              <TableCell>{contact.subject}</TableCell>
              <TableCell>{contact.category}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleView(contact)}
                    className="p-2"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(e) => handleDelete(contact._id, e)}
                    className="p-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Message Details">
        {selectedContact && (
          <ContactDetails
            contactId={selectedContact._id}
            onClose={handleClose}
          />
        )}
      </Modal>
    </div>
  );
};

export default ContactList;
