import React, { FC } from "react";
import styles from "./Avatar.module.scss";

interface AvatarProp {
  srcLink?: string; //Replace with blob if needed
}

const Avatar: FC<AvatarProp> = (props) => {
  return (
    <div className={styles.AvatarContainer} data-testid="Avatar">
      <div className={styles.Avatar}>
        <img
          src={
            props.srcLink
              ? require(`${props.srcLink}`)
              : require("./Vectordefault.png")
          }
          alt="profile-pic"
          className={styles.AvatarImg}
        />
      </div>
    </div>
  );
};

export default Avatar;
