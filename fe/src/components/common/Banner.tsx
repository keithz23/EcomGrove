import "react-lazy-load-image-component/src/effects/blur.css";
import img_1 from "../../assets/images/1.jpg";
import img_2 from "../../assets/images/2.jpg";
import img_3 from "../../assets/images/3.jpg";
import Carousel from "./Carousel";

export default function Banner() {
  const imageUrls = [img_1, img_2, img_3];
  return (
    <>
      <Carousel images={imageUrls} />
    </>
  );
}
