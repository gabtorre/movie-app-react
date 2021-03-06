import firebase from "firebase/app";
import "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { ReactComponent as FavoriteIcon } from "../../../Icons/Favorite.svg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const LikeButton = (props) => {
    const firestore = firebase.firestore();
    const post = firestore.collection("posts").doc(props.id)

    const [postData] = useDocumentData(post)

    const handleLike = async (e) => {
        e.preventDefault();

        await post.update({
            likes: firebase.firestore.FieldValue.arrayUnion(props.uid)
            })
    }

    return (
        <>
        { postData && postData.likes.length > 0 ?
            <OverlayTrigger
            key={props.key+"icon3"}
            placement="top"
            overlay={<Tooltip id={`tooltip-top`}>{postData.likes.length} Like</Tooltip>}
          >
              <FavoriteIcon className="post__icons" onClick={handleLike}/>
          </OverlayTrigger>
          : <OverlayTrigger
          key={props.key+"icon3"}
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>0 Likes</Tooltip>}
        >
            <FavoriteIcon className="post__icons" onClick={handleLike} key={props.key}/>
        </OverlayTrigger>
    }
    </>
    );
}

export default LikeButton;
