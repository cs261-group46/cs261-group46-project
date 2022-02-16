import React, { FC } from "react";
import styles from "./StrengthIndicator.module.scss";
import Twemoji from "react-twemoji-17";

interface StrengthIndicatorProps {
  password: string | undefined;
}

const calculateStrength: (password: string | undefined) => number = (
  password: string | undefined
) => {
  let passwordRating = 0;
  let maxReturn = 4;
  if (!password) return 0;

  if (password.length >= 10) {
    passwordRating++;
  } else {
    maxReturn = 2;
  }

  const capitalLetters = /[A-Z]/;
  const lowercaseLetters = /[a-z]/;
  const numbers = /[0-9]/;
  const symbol = /-|_|\.|,|\[|]|\(|'|\)|`|@|!|\\|\/|\^|\*|\?|\||\$/;

  if (capitalLetters.test(String(password))) {
    passwordRating++;
  }

  if (lowercaseLetters.test(String(password))) {
    passwordRating++;
  }

  if (numbers.test(String(password))) {
    passwordRating++;
  }

  if (symbol.test(String(password))) {
    passwordRating++;
  }

  return Math.min(passwordRating, 4, maxReturn);
};

const STRENGTH_BRACKETS = [
  {
    icon: "😟",
    percentage: 0,
  },
  {
    icon: "😔",
    percentage: 25,
  },
  {
    icon: "😌",
    percentage: 50,
  },
  {
    icon: "🙂",
    percentage: 75,
  },
  {
    icon: "😁",
    percentage: 100,
  },
];

const StrengthIndicator: FC<StrengthIndicatorProps> = (props) => {
  const strength = calculateStrength(props.password);
  const { icon, percentage } = STRENGTH_BRACKETS[Math.floor(strength)];

  const indicatorClasses = [styles.Indicator];
  switch (percentage) {
    case 25:
      indicatorClasses.push(styles.s25);
      break;
    case 50:
      indicatorClasses.push(styles.s50);
      break;
    case 75:
      indicatorClasses.push(styles.s75);
      break;
    case 100:
      indicatorClasses.push(styles.s100);
      break;
    default:
      indicatorClasses.push(styles.s0);
  }
  return (
    <div className={styles.StrengthIndicator} data-testid="StrengthIndicator">
      <span>Strength:</span>
      <Twemoji noWrapper={true} options={{ className: styles.Emoji }}>
        <div className={styles.Icon}>{icon}</div>
      </Twemoji>
      <div className={indicatorClasses.join(" ")} />
    </div>
  );
};

export default StrengthIndicator;
