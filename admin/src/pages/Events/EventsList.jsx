import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import api from "../../services/api";
import Table, { TableRow, TableCell } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import EventForm from "./EventForm";
import EventDetails from "./EventDetails";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { format } from "date-fns";
import Skeleton from "../../components/ui/Skeleton";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEventId, setViewingEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/events");
      const eventsData = Array.isArray(data) ? data : data.docs || [];
      setEvents(eventsData);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        toast.success("Event deleted");
        fetchEvents();
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleView = (id) => {
    setViewingEventId(id);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={20} /> Add Event
        </Button>
      </div>

      {loading ? (
        <Table headers={["Image", "Name", "Date", "Location", "Actions"]}>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="w-16 h-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-28" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : events.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No events found</p>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus size={20} /> Add Your First Event
          </Button>
        </div>
      ) : (
        <Table headers={["Image", "Name", "Date", "Location", "Actions"]}>
          {events.map((event) => (
            <TableRow key={event._id}>
              <TableCell>
                <img
                  src={event.image?.thumb || event.image?.url || event.image}
                  alt={event.name}
                  className="w-16 h-16 object-cover border-2 border-black"
                />
              </TableCell>
              <TableCell className="font-bold">{event.name}</TableCell>
              <TableCell>
                {format(new Date(event.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleView(event._id)}
                    className="p-2"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(event)}
                    className="p-2"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(event._id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Add New Event"}
      >
        <EventForm event={editingEvent} onSuccess={handleSuccess} />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Event Details"
      >
        {viewingEventId && (
          <EventDetails
            eventId={viewingEventId}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default EventsList;
