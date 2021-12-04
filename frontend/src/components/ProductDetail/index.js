import { Row, Col, Button, Image } from "react-bootstrap";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/auth";
import ProductModal from "../Modal/ProductModal";
import "./style.css";
import Swal from "sweetalert2";
const ProductDetail = ({ picURL, name, price, stock, productId }) => {
  const [selectQuantity, setSelectQuantity] = useState(1);
  const [showProduct, setShowProduct] = useState(false);
  const context = useContext(AuthContext);
  return (
    <>
      <Row className="detail mt-3">
        <Col md={5} className="pe-0 border-end border-2">
          <div className="background-head">
            <Image src={picURL} />
          </div>
        </Col>
        <Col md={7} className="ps-0 bg-white">
          <Row className="detail-head g-0">
            <h6 className="ps-4 d-flex align-items-center">{name}</h6>
          </Row>
          <Row className="ps-5 pt-4 gap-4">
            <div className="d-flex align-items-center">
              <div className="detail-block d-flex align-items-center justify-content-end">
                <h5>Price:</h5>
              </div>
              <div className="ms-4 d-flex align-items-center justify-content-center background-detail">
                <h5>{price} ฿</h5>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="detail-block d-flex align-items-center justify-content-end">
                <div className="text-end">
                  <h5>Quantity:</h5>
                  <h4>Stock: {stock >= 0 ? stock : 0}</h4>
                </div>
              </div>
              <div className="ms-4 mb-4 d-flex align-items-center justify-content-center background-detail">
                <input
                  className="center-block text-center"
                  type="number"
                  placeholder="1"
                  min="1"
                  max={stock}
                  onChange={(e) => {
                    setSelectQuantity(e.target.value);
                  }}
                />
              </div>
            </div>
            <Button
              className="btn-large blue"
              disabled={stock <= 0}
              onClick={() => {
                if (context.user) {
                  if(selectQuantity <= stock)
                    setShowProduct(true);
                  else{
                    Swal.fire({
                      title: "Oops! !",
                      html: "Not enough stock",
                      icon: "error",
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                    });
                  }
                } else {
                  window.location.replace("/login");
                }
              }}
            >
              Buy
            </Button>
          </Row>
        </Col>
      </Row>

      {/* ------- Modal ------- */}

      <ProductModal
        picURL={picURL}
        name={name}
        totalPrice={price * selectQuantity}
        selectQuantity={selectQuantity}
        productId={productId}
        showProduct={showProduct}
        setShowProduct={setShowProduct}
      />
    </>
  );
};
export default ProductDetail;
