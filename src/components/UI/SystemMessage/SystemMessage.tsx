import React, { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import { isPropertySignature } from 'typescript';
import { parentPort } from 'worker_threads';
import styles from './SystemMessage.module.scss';

interface SystemMessageProps {
    sort: "popup" | "inline"
    type: "warning" | "alert" | "information"
    description: string
    visible: boolean
    children?: React.ReactNode
}

const SystemMessage: FC<SystemMessageProps> = (props) => {

  const [visible, setVisible] = useState(props.visible)

  const handleClick = () => {
    setVisible(prevState => !prevState)
  }

  if (props.sort === "inline" && visible) {
    return (
        <div className={styles.SystemMessage+ ' ' + 
                        (props.type === "warning" ? styles.warning : '') + ' ' + 
                        (props.type === "alert" ? styles.alert : '') + ' ' + 
                        (props.type === "information" ? styles.information : '')} data-testid="SystemMessage">
          <span onClick={handleClick}>&#10006;</span>
          <h1>{props.type}</h1>
          <p>{props.description}</p>
        </div>
    )
  }
  else if (props.sort === "popup" && visible) {
    return ReactDOM.createPortal(
      <div className={styles.PopUpModal}>
        <div className={styles.PopUpSystemMessage+ ' ' + 
                        (props.type === "warning" ? styles.warning : '') + ' ' + 
                        (props.type === "alert" ? styles.alert : '') + ' ' + 
                        (props.type === "information" ? styles.information : '')} data-testid="SystemMessage">
          <span onClick={handleClick}>&#10006;</span>
          <h1>{props.type}</h1>
          <p>{props.description}</p>
        </div>
      </div>,
    document.getElementById('modal-root')!,
    );
  }

  return null
};

export default SystemMessage;
