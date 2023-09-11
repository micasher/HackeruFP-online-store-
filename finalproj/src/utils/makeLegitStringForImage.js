import defPicForCard from "../assets/imgs/no-image-icon.png";
import defPicForUser from "../assets/imgs/avatar.jpg";

const makeALegitStringForImage = (obj, userOrCard = "card") => {
  let base64String = null;
  if (obj && obj.image && obj.image.dataStr) {
    base64String = obj.image.dataStr;
    base64String = atob(base64String.toString("base64")).split("base64,")[1];
    if (obj.image.imageFile && obj.image.imageFile.contentType) {
      return `data:${obj.image.imageFile.contentType};base64,${base64String}`;
    }
    return `data:image/png;base64,${base64String}`;
  }
  return userOrCard == "user" ? defPicForUser : defPicForCard;
};

export default makeALegitStringForImage;
