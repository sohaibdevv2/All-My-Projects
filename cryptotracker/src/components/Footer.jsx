import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandMedium,
} from "@tabler/icons-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer>
        <div className="footer-content">
          <div className="footer-content__socials">
            <a
              href="https://www.linkedin.com/in/sohaib-m-malik/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandLinkedin width={34} height={34} className="footer-content__icon" />
            </a>
            <a
              href="https://github.com/sohaibdevv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub width={34} height={34} className="footer-content__icon" />
            </a>
            <a
              href="https://medium.com/@sohaibmalikdev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandMedium width={34} height={34}  className="footer-content__icon" />
            </a>
          </div>

          <div className="footer-content__text">
              <p>
              &copy; Copyright {currentYear}{" "}
              <a
                className="github-link"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/sohaibdevv"
                >
                Sohaibdevv
              </a>
              . Sharing is appreciated with attribution.
              </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
