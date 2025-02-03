import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import userService from "../services/user_service";
import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import imageService from "../services/image_service";

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

  const onSubmit = async (data: FormData) => {
    try {
      let avatarUrl ='';
      if (data.img && data.img[0]) {
        const { request } = imageService.uploadImage(data.img[0]);
        const response = await request;
        avatarUrl = response.data.url;
      }

      const user = {
        username: data.username,
        password: data.password,
        avatar: avatarUrl
      };

      const { request } = userService.register(user);
      await request;
      console.log('User registered successfully');
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Internal error, did you enter all fields?");
      }
      console.error(error);
    }
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
          {errorMessage && (
            <div className="text-danger text-center mb-3">{errorMessage}</div>
          )}
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;