import Btc from "../images/hero/bitcoin.png";
import Eth from "../images/hero/ethereum.png";
import chooseMain from "../images/chooseus/choose-main.webp";

function CryptoCoins() {
  return (
    <>
      <section id="CryptoCoins" className="cryptocoins-section">
        <div className="container">
          <div className="cryptocoins-content">
            <img
              alt="coin_img"
              className="cryptocoins-content__btc"
              src={Btc}
            />
            <img
              alt="coin_img"
              className="cryptocoins-content__eth"
              src={Eth}
            />
            <div className="cryptocoins-content__text">
              <img
                alt="crypto_group__photo"
                className="cryptocoins-content__img"
                src={chooseMain}
              />
            </div>
            <div className="cryptocoins-content2">
              <img
                alt="coin_img"
                className="cryptocoins-content2__btc2"
                src={Btc}
              />

              <img
                alt="coin_img"
                className="cryptocoins-content2__eth2"
                src={Eth}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CryptoCoins;
