import React, { FC } from "react";
import Button, { ButtonProps } from "../Button/Button";
import Card from "../Card/Card";
import Icon from "../Icon/Icon";
import Title from "../Title/Title";
import styles from "./ContentCard.module.scss";

interface ContentCardProps {
  heading: string;
  className?: string;

  sections: {
    title: string;
    content: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
  }[];

  buttons?: ButtonProps[];
}

const ContentCard: FC<ContentCardProps> = (props) => (
  <Card className={`${styles.ContentCard} ${props.className ?? ""}`}>
    <div className={styles.Heading} data-testid={"ContentCard"}>
      {props.heading}
    </div>

    {props.sections.map((section, i) => (
      <div key={i} className={styles.Section}>
        <div className={styles.title}>
          {section.icon && <Icon icon={section.icon} className={styles.Icon} />}
          <Title className={styles.subtitle} text={`${section.title}:`} />
        </div>
        <div className={`${styles.subtext} ${section.className ?? ""}`}>
          {section.content}
        </div>
      </div>
    ))}

    <div className={styles.Buttons}>
      {props.buttons &&
        props.buttons.map((button, i) => (
          <Button key={i} className={styles.Button} {...button} />
        ))}
    </div>
  </Card>
);

export default ContentCard;
