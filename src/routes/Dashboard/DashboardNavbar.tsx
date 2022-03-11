import styles from "./DashboardNavbar.module.scss";
import Button from "../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";

interface DashboardNavbarProps {
  hash?: string;
}

export const pageHashes = ["#home", "#learning", "#mentoring", "#expertise"];

export function hashToSlot(hash: string) {
  return pageHashes.indexOf(hash) + 1;
}

const DashboardNavbar = (props: DashboardNavbarProps) => {
  const { hash } = props;
  const navigate = useNavigate();

  const launchbarClickHandler = (slot: number) => {
    navigate(`/dashboard${pageHashes[slot - 1]}`);
  };

  const pageVisible = hash ? hashToSlot(hash) : undefined;

  return (
    <div className={styles.Switch}>
      <Button
        onClick={launchbarClickHandler.bind(null, 1)}
        className={`${styles.Button} ${pageVisible === 1 && styles.selected}`}
        icon="🏠"
      >
        Home
      </Button>
      <Button
        onClick={launchbarClickHandler.bind(null, 2)}
        className={`${styles.Button} ${pageVisible === 2 && styles.selected}`}
        icon="🧑‍🎓"
      >
        Your Learning
      </Button>
      <Button
        onClick={launchbarClickHandler.bind(null, 3)}
        className={`${styles.Button} ${pageVisible === 3 && styles.selected}`}
        icon="👨‍🏫"
      >
        Your Mentoring
      </Button>
      <Button
        onClick={launchbarClickHandler.bind(null, 4)}
        className={`${styles.Button} ${pageVisible === 4 && styles.selected}`}
        icon="💪"
      >
        Your Expertise
      </Button>
    </div>
  );
};

export default DashboardNavbar;
