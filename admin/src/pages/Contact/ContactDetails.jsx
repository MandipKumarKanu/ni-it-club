import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";
import { format } from "date-fns";

const ContactDetails = ({ contactId, onClose }) => {
  const [contact, setContact] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await api.get(`/contact/${contactId}`);
        setContact(data);
      } catch (error) {
        toast.error("Failed to load message");
      }
    };
    fetchContact();
  }, [contactId]);

  const onReply = async (data) => {
    setSending(true);
    try {
      await api.post(`/contact/${contactId}/reply`, data);
      toast.success("Reply sent successfully");
      setIsReplying(false);
      onClose();
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (!contact) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-4">
        <div>
          <p className="text-sm text-gray-500 font-bold">From</p>
          <p className="font-bold text-lg">{contact.name}</p>
          <p className="text-ni-blue">{contact.email}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 font-bold">Date</p>
          <p>{format(new Date(contact.createdAt), "PPpp")}</p>
          <p className="mt-2">
            <span className="bg-ni-neon px-2 py-1 text-xs font-bold border border-black">
              {contact.category.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 font-bold">Subject</p>
        <h3 className="text-xl font-bold">{contact.subject}</h3>
      </div>

      <div className="bg-gray-50 p-4 border-2 border-black">
        <p className="whitespace-pre-wrap">{contact.message}</p>
      </div>

      {contact.repliedAt && (
        <div className="bg-ni-cyan/10 p-4 border-2 border-ni-cyan">
          <p className="font-bold text-ni-cyan mb-2">
            Replied on {format(new Date(contact.repliedAt), "PPpp")}
          </p>
          <p className="text-sm">By: {contact.repliedBy?.name || "Admin"}</p>
        </div>
      )}

      {!isReplying ? (
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => setIsReplying(true)}>Reply</Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onReply)}
          className="space-y-4 pt-4 border-t-2 border-black"
        >
          <h4 className="font-bold text-lg">Reply to {contact.name}</h4>

          <Input
            label="Subject"
            defaultValue={`Re: ${contact.subject}`}
            {...register("replySubject", { required: "Subject is required" })}
            error={errors.replySubject}
          />

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Message</label>
            <textarea
              className="p-2 border-brutal focus:outline-none focus:ring-2 focus:ring-ni-neon min-h-[150px]"
              {...register("replyMessage", { required: "Message is required" })}
            ></textarea>
            {errors.replyMessage && (
              <span className="text-red-500 text-xs font-bold">
                {errors.replyMessage.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send Reply"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactDetails;
