import "./Testimonials.css";
import TestimonialCard from "../TestinomialsCard/TestimonialCard";
import Wasim from "../assets/wasim.jpg";
import Shahid from "../assets/shahid.jpeg";
import Shaheen from "../assets/shaheen.jpg";
import Shoaib from "../assets/shoaib.jpg";

const customers = [
  {
    fullName: "Wasim",
    image: Wasim,
    rating: [1, 1, 1, 1, 0.5],
    says: "Everything tasted fresh and flavorful. Highly recommend."
  },
  {
    fullName: "Shahid",
    image:Shahid,
    rating: [1, 1, 1, 1, 0],
    says: "The staff were so friendly and helpful. Great service",
  },
  {
    fullName: "Shoaib",
    image: Shoaib,
    rating: [1, 1, 1, 1, 0.5],
    says: "I had a great experience. Will be back soon.",
  },
  {
    fullName: "Shaheen",
    image: Shaheen,
    rating: [1, 1, 1, 1, 1],
    says: "The staff are wonderful. So kind and helpful.",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="container grid">
        <h2>Testimonials</h2>
        {customers.map((customer, index) => (
          <TestimonialCard key={index} customer={customer} />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
