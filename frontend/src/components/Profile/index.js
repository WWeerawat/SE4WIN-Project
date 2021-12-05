import { Row, Col, Button, Form } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { BsPersonCircle } from "react-icons/bs";
import { AuthContext } from "../../context/auth";
import { GET_USER_INFO } from "../../Graphql/Queries";
import { yupResolver } from "@hookform/resolvers/yup";
import { UPDATE_USER_INFO } from "../../Graphql/Mutations";
import * as yup from "yup";
import Header from "../../components/Header";
import InputMask from "react-input-mask";
import Swal from "sweetalert2";
import "./style.css";

const Profile = () => {
  const context = useContext(AuthContext);
  /*-------------------------Query----------------------------- */
  const { data } = useQuery(GET_USER_INFO);
  const [user, setUser] = useState();

  useEffect(() => {
    if (data) {
      setUser(data.me);
    }
  }, [data]);

  /*-------------------------Query----------------------------- */

  /*-------------------------Phone number modify----------------------------- */

  const phoneModify = (number) => {
    const showNumber =
      number.substring(0, 3) +
      "-" +
      number.substring(3, 6) +
      "-" +
      number.substring(6, 10);
    return showNumber;
  };

  /*-------------------------Phone number modify----------------------------- */

  /*-------------------------Input Mask----------------------------- */
  const [valuePhone, setvaluePhone] = useState("");

  const beforeMaskedValueChange = (newState, oldState, userInput) => {
    var { value } = newState;
    var selection = newState.selection;
    var cursorPosition = selection ? selection.start : null;

    // keep minus if entered by user
    if (value.endsWith("-") && userInput !== "-" && !valuePhone.endsWith("-")) {
      if (cursorPosition === value.length) {
        cursorPosition--;
        selection = { start: cursorPosition, end: cursorPosition };
      }
      value = value.slice(0, -1);
    }

    return {
      value,
      selection,
    };
  };
  /*-------------------------Input Mask----------------------------- */

  /*--------------------------Submit Form---------------------------- */
  const [updateUser] = useMutation(UPDATE_USER_INFO);
  const [changePassword, setChangePassword] = useState(false);
  const schema = yup.object().shape(
    {
      email: yup.string().notRequired(),
      password: yup
        .string()
        .notRequired()
        .nullable()
        .when("password", {
          is: (value) => value?.length,
          then: (rule) =>
            rule.min(7, "Please enter at least 7 characters password"),
        }),
      ConfirmPassword: yup.string().when("password", {
        is: (value) => value?.length,
        then: (rule) =>
          rule
            .required("Please enter confirm password")
            .oneOf([yup.ref("password"), null], "Passwords must match"),
      }),
      firstname: yup.string().notRequired(),
      lastname: yup.string().notRequired(),
      phoneNumber: yup
        .string()
        .notRequired()
        .nullable()
        .when("phoneNumber", {
          is: (value) => value?.length,
          then: (rule) =>
            rule
              .min(12, "Please enter valid phone number")
              .max(12, "Please enter valid phone number"),
        }),
      address: yup.string().notRequired(),
    },
    [
      // Add Cyclic deps here because when require itself
      ["password", "password"],
      ["phoneNumber", "phoneNumber"],
      ["password", "ConfirmPassword"],
    ]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (submit) => {
    const userId = { id: context.user.sub };
    delete submit.ConfirmPassword;
    if (submit.phoneNumber) {
      submit.phoneNumber = submit.phoneNumber.replaceAll("-", "");
    }
    Object.keys(submit).forEach((key) =>
      submit[key] === undefined || submit[key] === "" ? delete submit[key] : {}
    );
    if (Object.keys(submit).length !== 0) {
      submit = Object.assign(userId, submit);
      updateUser({
        variables: { input: submit },
      })
        .then(() => {
          Swal.fire({
            title: "Update profile success!",
            html: "Press Ok to continue",
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          handleEdit();
        })
        .catch((error) => {
          const err = error.message;
          Swal.fire({
            title: "Oops! !",
            html: err,
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        });
    } else {
      handleEdit();
    }
  };
  /*--------------------------Submit Form---------------------------- */

  /*--------------------------Button and Form display-----------------------------------*/

  const [editProfile, setEditProfile] = useState(true);
  const handleEdit = () => {
    setEditProfile(!editProfile);
    document.getElementById("userForm").reset();
  };

  /*--------------------------Button and Form display-----------------------------------*/

  return (
    <>
      {user && (
        <>
          <Header text="Profile" />
          <Form onSubmit={handleSubmit(onSubmit)} id="userForm">
            <Row className="d-flex mt-3 bg-white profile-container gx-0">
              <Col
                md={3}
                className="d-block justify-content-center profile-image"
              >
                <div className="mb-3">
                  <BsPersonCircle />
                </div>
                <div className="text-center">
                  {editProfile && (
                    <Button className="btn-medium blue" onClick={handleEdit}>
                      Edit Profile
                    </Button>
                  )}
                  {!editProfile && (
                    <Button className="btn-medium green" type="submit">
                      Save
                    </Button>
                  )}
                </div>
              </Col>
              <Col md={4}>
                <Row className="gap-1">
                  <Form.Group className="d-flex mb-3 align-items-baseline">
                    <Form.Label className="alter-title-block">
                      <h5>Email:</h5>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={user.email}
                      disabled={editProfile}
                      {...register("email")}
                    />
                  </Form.Group>
                  <Form.Group
                    className={
                      errors["password"]?.message
                        ? "d-flex align-items-baseline"
                        : "d-flex mb-3 align-items-baseline"
                    }
                  >
                    <Form.Label className="alter-title-block">
                      <h5>Password:</h5>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="*******"
                      disabled={editProfile}
                      {...register("password")}
                      onChange={(event) => {
                        if (event.target.value !== "") setChangePassword(true);
                        else setChangePassword(false);
                      }}
                    />
                  </Form.Group>
                  {errors["password"]?.message && (
                    <p className="errorMessage text-end">
                      {errors["password"]?.message}
                    </p>
                  )}

                  {changePassword && (
                    <>
                      <Form.Group
                        className={
                          errors["ConfirmPassword"]?.message
                            ? "d-flex align-items-baseline"
                            : "d-flex mb-3 align-items-baseline"
                        }
                      >
                        <Form.Label className="alter-title-block">
                          <h5>Confirm password:</h5>
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="*******"
                          disabled={editProfile}
                          {...register("ConfirmPassword")}
                        />
                      </Form.Group>
                      {errors["ConfirmPassword"]?.message && (
                        <p className="errorMessage text-end">
                          {errors["ConfirmPassword"]?.message}
                        </p>
                      )}
                    </>
                  )}

                  <Form.Group className="d-flex mb-3 align-items-baseline">
                    <Form.Label className="alter-title-block">
                      <h5>First name:</h5>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={user.firstname}
                      disabled={editProfile}
                      {...register("firstname")}
                    />
                  </Form.Group>
                  <Form.Group className="d-flex mb-3 align-items-baseline">
                    <Form.Label className="alter-title-block">
                      <h5>Last name:</h5>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={user.lastname}
                      disabled={editProfile}
                      {...register("lastname")}
                    />
                  </Form.Group>
                </Row>
              </Col>
              <Col md={4}>
                <Form.Group
                  className={
                    errors["phoneNumber"]?.message
                      ? "d-flex align-items-baseline"
                      : "d-flex mb-3 align-items-baseline"
                  }
                >
                  <Form.Label className="profile-title-block">
                    <h5>Phone:</h5>
                  </Form.Label>
                  {editProfile ? (
                    <Form.Control
                      type="tel"
                      placeholder={phoneModify(user.phoneNumber)}
                      disabled={true}
                    />
                  ) : (
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <InputMask
                          mask="099-999-9999"
                          maskChar={null}
                          value={valuePhone}
                          onChange={(e) => {
                            setvaluePhone(e.target.value);
                            field.onChange(e);
                          }}
                          beforeMaskedValueChange={beforeMaskedValueChange}
                        >
                          {(...inputProps) => (
                            <Form.Control
                              {...inputProps}
                              type="tel"
                              placeholder={phoneModify(user.phoneNumber)}
                            />
                          )}
                        </InputMask>
                      )}
                    />
                  )}
                </Form.Group>
                {errors["phoneNumber"]?.message && (
                  <p className="errorMessage text-end">
                    {errors["phoneNumber"]?.message}
                  </p>
                )}
                <Form.Group className="d-flex mb-3 align-items-baseline">
                  <Form.Label className="profile-title-block">
                    <h5>address:</h5>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={user.address}
                    as="textarea"
                    disabled={editProfile}
                    {...register("address")}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  );
};
export default Profile;
