import { useState, useEffect } from "react";
import { X, Linkedin, Github, Twitter, Instagram } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

const TeamDetails = ({ memberId, onClose }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data } = await api.get(`/team/${memberId}`);
        setMember(data);
      } catch (error) {
        toast.error("Failed to load member details");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [memberId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!member) return <div className="p-4">Member not found</div>;

  return (
    <div className="space-y-6 relative">
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-black text-white p-2 rounded-full hover:bg-ni-neon hover:text-black transition-colors z-10"
      >
        <X size={20} />
      </button>

      <div className="border-b-2 border-black pb-4 pr-10">
        <h2 className="text-3xl font-bold">{member.name}</h2>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {Array.isArray(member.role) ? (
            member.role.map((r, index) => (
              <span
                key={index}
                className="bg-ni-neon px-3 py-1 text-sm font-bold border border-black shadow-[2px_2px_0px_0px_#000]"
              >
                {r}
              </span>
            ))
          ) : (
            <span className="bg-ni-neon px-3 py-1 text-sm font-bold border border-black shadow-[2px_2px_0px_0px_#000]">
              {member.role}
            </span>
          )}
          <span className="bg-gray-200 px-3 py-1 text-sm font-bold border border-black shadow-[2px_2px_0px_0px_#000]">
            {member.jobType || "Member"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="border-2 border-black shadow-brutal overflow-hidden mb-6">
            <img
              src={member.image?.url || member.image}
              alt={member.name}
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="flex gap-4 justify-center">
            {member.socialLinks?.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="bg-ni-blue text-white p-2 border-2 border-black hover:translate-y-[-2px] hover:shadow-brutal transition-all"
              >
                <Linkedin size={24} />
              </a>
            )}
            {member.socialLinks?.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white p-2 border-2 border-black hover:translate-y-[-2px] hover:shadow-brutal transition-all"
              >
                <Github size={24} />
              </a>
            )}
            {member.socialLinks?.twitter && (
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="bg-sky-400 text-white p-2 border-2 border-black hover:translate-y-[-2px] hover:shadow-brutal transition-all"
              >
                <Twitter size={24} />
              </a>
            )}
            {member.socialLinks?.instagram && (
              <a
                href={member.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="bg-pink-600 text-white p-2 border-2 border-black hover:translate-y-[-2px] hover:shadow-brutal transition-all"
              >
                <Instagram size={24} />
              </a>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {member.bio && (
            <div>
              <h3 className="font-bold text-xl mb-2 border-l-4 border-ni-neon pl-3">
                Bio
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{member.bio}</p>
            </div>
          )}

          {member.skills && member.skills.length > 0 && (
            <div>
              <h3 className="font-bold text-xl mb-2 border-l-4 border-ni-neon pl-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-white px-2 py-1 text-sm font-bold border border-black"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 pt-4 border-t-2 border-gray-200">
            <p>Joined: {format(new Date(member.createdAt), "MMMM dd, yyyy")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
