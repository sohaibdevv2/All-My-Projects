import { HashLink } from "react-router-hash-link";
import bruschettaImage from "../assets/bruschetta.jpg";
import greekSaladImage from "../assets/greek-salad.jpg";
import lemonDessertImage from "../assets/lemon-dessert.jpeg";
import "./WeekSpecials.css";
import MealCard from "../MealCard/MealCard";

const meals = [
  {
    name: "Greek Salad",
    image: greekSaladImage,
    price: "Rs. 850",
    description: `The famous greek salad of crispy lettuce, peppers, olives and
      our New York style feta cheese, garnished with crunchy garlic and rosemary
      croutons.`,
  },
  {
    name: "Bruschetta",
    image: bruschettaImage,
    price: "Rs. 950",
    description: `Our Bruschetta is made from grilled bread that has been
      smeared with garlic and seasoned with salt and olive oil.`,
  },
  {
    name: "Lemon Dessert",
    image: lemonDessertImage,
    price: "Rs. 650",
    description: `This comes straight from grandma's recipe book, every last
      ingredient has been sourced and is as authentic as can be imagined.`,
  },
];

const WeekSpecials = () => {

  const handleClick = () => {
    const imageUrl = require("../../../layout/assets/menu.webp");
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="container grid week-specials" id="menu">
      <div className="week-specials-header">
        <h2>This week specials!</h2>
        <HashLink className="button-primary" to="/#menu" onClick={handleClick}>
          Online Menu
        </HashLink>
      </div>
      {meals.map((meal, index) => (
        <MealCard key={index} meal={meal} />
      ))}
    </section>
  );
};

export default WeekSpecials;
