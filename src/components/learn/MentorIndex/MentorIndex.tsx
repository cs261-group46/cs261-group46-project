import React, { FC, useEffect, useState } from "react";
import { index } from "../../../api/api";
import MentorCard from "./MentorCard/MentorCard";
import styles from "./MentorIndex.module.scss";
import { Mentor } from "./MentorIndex.d";

interface MentorIndexProps {}

const MentorIndex: FC<MentorIndexProps> = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);

  const indexMentors = async () => {
    try {
      const data = await index({
        resource: "mentors",
        args: {
          fields: ["user", "about", "topics", "first_name"],
          filters: ["suitable"],
        },
      });

      console.log(data);

      setMentors(data.mentors);
    } catch (errors) {
      console.log(errors);
    }
  };

  useEffect(() => {
    indexMentors();
  }, []);

  const mentorCards = mentors.map((mentor) => (
    <MentorCard key={mentor.id} mentor={mentor} />
  ));

  return (
    <div className={styles.MentorIndex} data-testid="MentorIndex">
      {mentorCards}
    </div>
  );
};

export default MentorIndex;
