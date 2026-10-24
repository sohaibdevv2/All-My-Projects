import "./NotFound.css";
import { faPersonDigging } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotFound = () => {
  return (
    <div className="container page-not-found">
      <FontAwesomeIcon icon={faPersonDigging} size="3x"/>
      <h1>Feature Under Construction</h1>
      <h2>This feature is still being refined, so check back for the finished product.</h2>
      </div>
  );
};

export default NotFound;
