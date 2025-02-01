import { FC, useEffect, useState } from "react";
import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import userService, { User } from "../services/user_service";
import 'bootstrap/dist/css/bootstrap.min.css';

interface FormData {
  username: string;
  password: string;
  img: File[];
}

const RegistrationForm: FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
            console.log(error);
            if (error.response && error.response.status === 409) {
              setErrorMessage(error.response.data);
            } else {
              setErrorMessage("Internal error, did you enter all fields?");
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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm" style={{ width: '350px' }}>
        <h2 className="text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center mb-3">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : avatar}
              alt="Avatar"
              className="rounded-circle"
              style={{ width: '100px', height: '100px' }}
            />
            <div>
              <FontAwesomeIcon
                icon={faImage}
                onClick={() => inputFileRef.current?.click()}
                style={{ cursor: 'pointer' }}
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
              style={{ display: 'none' }}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          {errorMessage && (
            <div className="text-danger text-center mb-3">{errorMessage}</div>
          )}
          <button type="submit" className="btn btn-dark w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
