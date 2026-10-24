import chefsMarioAndAdrian1Img from "../assets/chefs-mario-and-adrian_1.jpg";
import chefsMarioAndAdrian2Img from "../assets/chefs-mario-and-adrian_2.jpg";
import "./OurStory.css";

const OurStory = () => {
  return (
    <section className="container grid our-story" id="about">
      <div className="our-story-description">
        <h2>Our Story</h2>
        <p>
          Little Lemon was born in the <em>lively</em> heart of Karachi, where
          the aroma of spices mingles with the sea breeze, sat{" "}
          <strong>Little Lemon</strong>. A small, family-run restaurant, it
          brought a taste of the Mediterranean to the city's vibrant food scene.
        </p>

        <p>
          <strong>Mario</strong>, with his warm smile, greeted everyone like
          family. His partner, <strong>Adrian</strong>, worked his magic in the
          kitchen, blending traditional Mediterranean flavors with a hint of
          Karachi spice.
        </p>

        <p>
          <strong>Little Lemon's</strong> specialty? Their{" "}
          <em>lemon-infused grilled fish</em>, a perfect fusion of coastal
          cuisines. Their freshly baked pita, warm and fluffy, was a local
          favorite. Every dish, from the creamy hummus to the fragrant chicken
          tagine, was made with love.
        </p>

        <p>
          When the Karachi heat finally broke, a sudden storm hit. The power
          went out, plunging the street into darkness. But{" "}
          <strong>Little Lemon's</strong> kitchen glowed with candlelight.{" "}
          <strong>Mario</strong> brought out chilled lemonade, and{" "}
          <strong>Adrian</strong> grilled fish over charcoal. The customers,
          huddled together, shared stories and laughter.
        </p>

        <p>
          Even in the darkness, <strong>Little Lemon</strong> shone. It wasn't
          just the food, but the feeling of family, a little slice of
          Mediterranean sunshine in the heart of Karachi.
        </p>
      </div>
      <div className="our-story-chefs">
        <img src={chefsMarioAndAdrian1Img} alt="Chefs Mario and Adrian #1" />
        <img src={chefsMarioAndAdrian2Img} alt="Chefs Mario and Adrian #2" />
      </div>
    </section>
  );
};

export default OurStory;
