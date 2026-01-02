import { useState } from "react";
import Section from "@/globals/section";

type ExtractedSkillsProps = {
  Skills: string[] | [];
};

const SkillCard = ({ skill }: { skill: string }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <p className="text-md font-semibold">{skill}</p>
    </div>
  );
};

const ExtractedSkillsSection = ({ Skills }: ExtractedSkillsProps) => {
  const [showAll, setShowAll] = useState(false);

  // Determine which skills to display
  const displayedSkills = showAll ? Skills : Skills?.slice(0, 8);

  return (
    <Section>
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Extracted Skills</h1>
      </div>
      <div className="bg-white p-8 border-2 border-gray-300 rounded-lg">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {displayedSkills?.map((skill, index) => (
          <SkillCard key={index} skill={skill} />
        ))}
      </div>

      {/* See More / See Less Button */}
      {Skills?.length > 8 && (
       <div className="flex justify-center">
         <div className="mt-4 text-center  w-fit ">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-cyan-600 font-semibold hover:underline cursor-pointer"
          >
            {showAll ? "See Less" : "See More"}
          </button>
        </div>
       </div>
      )}
      </div>
    </Section>
  );
};

export default ExtractedSkillsSection;
