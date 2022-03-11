import React, { FC, useCallback, useEffect, useState } from "react";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import { index, store } from "../../../api/api";
import { MentorType } from "../../../types/Mentor";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import styles from "./FindMentor.module.scss";
import Tag from "../../../components/UI/Tag/Tag";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";

interface FindMentorProps {}

const FindMentor: FC<FindMentorProps> = () => {
  const { mentee_id = null, mentee_mentorship_requests_sent = [] } =
    UseVerifyUser<{
      mentee_id: number | null;
      mentee_mentorship_requests_sent: { mentor: MentorType }[];
    }>({
      userDataPolicies: [
        {
          dataPoint: "mentee.id",
          redirectOnFail: "/dashboard",
        },
        {
          dataPoint: "mentee.mentor.id",
          redirectOnSuccess: "/dashboard",
        },
        {
          dataPoint: "mentee.mentorship_requests_sent",
        },
      ],
    });

  const showMessage = UseSystemMessage();

  const [mentors, setMentors] = useState<MentorType[]>([]);

  useEffect(() => {
    if (mentors.length > 0) {
      setMentors((prevMentors) =>
        prevMentors.filter(
          (mentor) =>
            !mentee_mentorship_requests_sent.find(
              (req) => req.mentor.id === mentor.id
            )
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mentee_mentorship_requests_sent), mentors.length]);

  const indexMentors = useCallback(async () => {
    try {
      const data = await index({
        resource: "mentors",
        args: {
          fields: [
            "id",
            "about",
            "score",
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
      showMessage("error", errors);
    }
  }, [showMessage]);

  useEffect(() => {
    indexMentors();
  }, [indexMentors]);

  const requestMentorHandler = async (mentorId: number) => {
    try {
      const body = {
        mentee: mentee_id,
        mentor: mentorId,
      };

      await store({
        resource: "mentorshiprequests",
        body: body,
      });

      setMentors((prevMentors) =>
        prevMentors.filter((mentor) => mentor.id !== mentorId)
      );
      showMessage("success", "Mentorship request sent successfully.");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const mentorCards = mentors?.map((mentor) => (
    // <MentorCard key={mentor.id} mentor={mentor} />
    <ContentCard
      heading={`${mentor.user.first_name} ${mentor.user.last_name}`}
      sections={[
        {
          title: "Email",
          content: mentor.user.email,
        },
        {
          title: "About",
          content: mentor.about,
        },
        {
          className: styles.tags,
          title: "Skills",
          content: mentor.topics.map((topic) => (
            <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
          )),
        },
        {
          title: "Rating",
          content: (
            <StarPicker
              type="inline"
              value={Math.round(mentor.score)}
              size={"30px"}
            />
          ),
        },
        {
          className: styles.tags,
          title: "Department",
          content: mentor.user.department.name,
        },
      ]}
      buttons={[
        {
          children: "Request Mentorship",
          buttonStyle: "primary",
          onClick: requestMentorHandler.bind(null, mentor.id),
        },
      ]}
    />
  ));

  return (
    <DashboardSubpageLayout title="Find a Mentor">
      <div className={styles.FindMentor} data-testid="FindMentor">
        {mentorCards}
        {mentorCards &&
          mentorCards.length === 0 &&
          "Sorry, couldn't find any available mentors"}
        {mentorCards === undefined && <LoadingSpinner />}
      </div>
    </DashboardSubpageLayout>
  );
};

export default FindMentor;
