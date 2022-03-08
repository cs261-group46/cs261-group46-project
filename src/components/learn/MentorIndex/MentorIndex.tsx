import React, { FC, useEffect, useState } from "react";
import { index } from "../../../api/api";
import MentorCard from "./MentorCard/MentorCard";
import styles from "./MentorIndex.module.scss";
import { MentorType } from "../../../types/Mentor";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";

interface MentorIndexProps {}

const MentorIndex: FC<MentorIndexProps> = () => {
  const [mentors, setMentors] = useState<MentorType[]>();

  const indexMentors = async () => {
    try {
      const data = await index({
        resource: "mentors",
        args: {
          fields: [
            "id",
            "about",
            "topics.topic",
            "user.first_name",
            "user.last_name",
            "user.department",
            "user.email",
          ],
          filters: ["suitable"],
        },
      });

      setMentors(data.mentors);
    } catch (errors) {
      console.log(errors);
    }
  };

  useEffect(() => {
    indexMentors();
  }, []);

  const mentorCards = mentors?.map((mentor) => (
    <MentorCard key={mentor.id} mentor={mentor} />
  ));

  return (
    <div className={styles.MentorIndex} data-testid="MentorIndex">
      {mentorCards}
      {mentorCards &&
        mentorCards.length === 0 &&
        "Sorry, couldn't find any available mentors"}
      {mentorCards === undefined && <LoadingSpinner />}
    </div>
  );
};

export default MentorIndex;
