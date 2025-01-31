import { FC} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import userService, { User } from "../services/user_service";

interface FormData {
  username: string;
  password: string;

}
const LoginForm: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
        const user: User = {
          username: data.username,
          password: data.password,
        };
        const { request } = userService.login(user);
        request
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });  
  };



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
          <h2 style={{ alignSelf: "center" }}>Login Form</h2>
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
          <button type="submit" className="btn btn-outline-primary mt-3">
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
