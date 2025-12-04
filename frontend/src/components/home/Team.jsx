import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { AngleBracket } from "../ui/Doodles";

import Skeleton from "../ui/Skeleton";

const Team = ({ data, loading }) => {
  const teamMembers = data || [];

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16 relative">
          <Skeleton className="h-16 w-64" />
          <Skeleton className="h-12 w-40 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="relative">
              <div className="absolute inset-0 bg-ni-black transform translate-x-4 translate-y-4 border-brutal"></div>
              <div className="relative z-10 bg-ni-white border-brutal p-6 flex flex-col items-center h-full">
                <Skeleton className="w-24 h-24 rounded-full mb-6" />
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-4 w-32 mb-6" />
                <div className="flex gap-2 w-full justify-center mb-6">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex gap-4 mt-auto">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-16 relative">
        <h2 className="text-6xl font-black uppercase relative z-10">
          Meet Our{" "}
          <span className="text-ni-blue decoration-wavy underline">Team</span>
        </h2>
        <AngleBracket className="absolute -left-12 top-0 h-20 text-ni-pink hidden md:block" />
        <Button variant="outline" className="hidden md:flex transform rotate-2">
          View All Members
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {teamMembers.map((member, index) => (
          <div key={member._id} className="relative group">
            <div className="absolute inset-0 bg-ni-black transform translate-x-4 translate-y-4 border-brutal"></div>
            <Card
              rotate={index % 2 === 0 ? 1 : -1}
              className="relative z-10 h-full flex flex-col items-center text-center group-hover:-translate-y-2 transition-transform"
            >
              <div className="w-28 h-28 rounded-full border-brutal bg-ni-gray mb-6 overflow-hidden relative">
                <img
                  src={member.image?.thumb || member.image?.url || member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                />
                <div className="absolute inset-0 border-4 border-ni-black rounded-full opacity-20"></div>
              </div>
              <h3 className="text-2xl font-black bg-ni-neon px-2 transform -rotate-1 mb-2 border-2 border-ni-black">
                {member.name}
              </h3>

              <div className="flex flex-wrap justify-center gap-1 mb-2">
                {Array.isArray(member.role) ? (
                  member.role.map((r, idx) => (
                    <span
                      key={idx}
                      className="text-ni-pink font-bold uppercase tracking-widest text-sm"
                    >
                      {r}
                      {idx < member.role.length - 1 ? ", " : ""}
                    </span>
                  ))
                ) : (
                  <span className="text-ni-pink font-bold uppercase tracking-widest text-sm">
                    {member.role}
                  </span>
                )}
              </div>

              {/* Skills/Description Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6 border-t-4 border-ni-black pt-4 w-full">
                {member.specializedIn &&
                  member.specializedIn
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill)
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-ni-black text-ni-white px-3 py-1 text-sm font-bold uppercase"
                      >
                        {skill}
                      </span>
                    ))}
              </div>

              <div className="flex gap-4 mt-auto">
                {member.socialLinks?.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border-brutal hover:bg-ni-black hover:text-ni-white transition-colors transform hover:scale-110"
                  >
                    <FaGithub size={20} />
                  </a>
                )}
                {member.socialLinks?.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border-brutal hover:bg-ni-black hover:text-ni-white transition-colors transform hover:scale-110"
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}
                {member.socialLinks?.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border-brutal hover:bg-ni-black hover:text-ni-white transition-colors transform hover:scale-110"
                  >
                    <FaTwitter size={20} />
                  </a>
                )}
                {member.socialLinks?.instagram && (
                  <a
                    href={member.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border-brutal hover:bg-ni-black hover:text-ni-white transition-colors transform hover:scale-110"
                  >
                    <FaInstagram size={20} />
                  </a>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
