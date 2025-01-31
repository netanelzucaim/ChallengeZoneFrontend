import { FC, useEffect, useState } from "react";
import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import userService, { User } from "../services/user_service";

interface FormData {
  username: string;
  password: string;
  img: File[];
}
const RegistrationForm: FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const inputFileRef = useRef<HTMLInputElement>(null)
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [img] = watch(["img"]);
  const inputFileRef: { current: HTMLInputElement | null } = { current: null };

  const onSubmit = (data: FormData) => {
    console.log(data);
    const { request } = userService.uploadImage(data.img[0]);
    request
      .then((response) => {
        console.log(response.data);
        const user: User = {
          username: data.username,
          password: data.password,
          avatar: response.data.url,
        };
        const { request } = userService.register(user);
        request
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error)
            if (error.response && error.response.status === 409) {
              setErrorMessage(error.response.data);
            } else {
                setErrorMessage("internal erorr, you entered the whole fields?");
            }
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (img != null && img[0]) {
      setSelectedImage(img[0]);
    }
  }, [img]);
  const { ref, ...restRegisterParams } = register("img");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "lightgray",
            padding: "10px",
            margin: "10px",
            borderRadius: "5px",
            width: "50%",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <h2 style={{ alignSelf: "center" }}>Registration Form</h2>
          <img
            style={{ width: "200px", height: "200px", alignSelf: "center" }}
            src={selectedImage ? URL.createObjectURL(selectedImage) : avatar}
          ></img>
          <div style={{ alignSelf: "end" }}>
            <FontAwesomeIcon
              className="fa-xl"
              icon={faImage}
              onClick={() => {
                inputFileRef.current?.click();
              }}
            />
          </div>

          <input
            ref={(item) => {
              inputFileRef.current = item;
              ref(item);
            }}
            {...restRegisterParams}
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
          />
          <label>username:</label>
          <input
            {...register("username")}
            type="text"
            className="form-control"
          />
          <label>password:</label>
          <input
            {...register("password")}
            type="password"
            className="form-control"
          />
          {errorMessage && (
            <div style={{ color: "red", alignSelf: "center" }}>{errorMessage}</div>
          )}
          <button type="submit" className="btn btn-outline-primary mt-3">
            Register
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
