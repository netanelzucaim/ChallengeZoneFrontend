import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import postsService from "../../services/posts_service";
import imageService from "../../services/image_service";
import avatar from "../../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PostFormModal.css"; // Import custom CSS for additional styling

const schema = z.object({
  content: z
    .string()
    .nonempty("Content is required")
    .min(3, "Content must be at least 3 characters"),
  img: z.instanceof(FileList).optional(),
});

type PostFormData = z.infer<typeof schema>;

interface PostFormModalProps {
  show: boolean;
  handleClose: () => void;
  onPostAdded: () => void;
}

const PostFormModal: FC<PostFormModalProps> = ({
  show,
  handleClose,
  onPostAdded,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({ resolver: zodResolver(schema) });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [img] = watch(["img"]);
  const inputFileRef: { current: HTMLInputElement | null } = { current: null };

  const onSubmit = async (data: PostFormData) => {
    try {
      let postPicUrl = "";
      if (data.img && data.img[0]) {
        const { request } = imageService.uploadImage(data.img[0]);
        const response = await request;
        postPicUrl = response.data.url;
      }

      const post = {
        content: data.content,
        postPic: postPicUrl,
      };

      const { request } = postsService.addPost(post);
      await request;
      console.log("Post added successfully");
      onPostAdded();
      handleClose();
      resetForm();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to add post");
    }
  };

  const resetForm = () => {
    reset();
    setSelectedImage(null);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (img != null && img[0]) {
      setSelectedImage(img[0]);
    }
  }, [img]);

  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);

  const { ref, ...restRegisterParams } = register("img");

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="content">
              Content
            </label>
            <textarea
              {...register("content")}
              className="form-control"
              id="content"
              name="content"
              rows={3}
            />
            {errors.content && (
              <p className="text-danger">{errors.content.message}</p>
            )}
          </div>

          <div className="text-center mb-3">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : avatar}
              alt="Avatar"
              className="rounded-circle"
              style={{ width: "100px", height: "100px" }}
            />
            <div>
              <FontAwesomeIcon
                icon={faImage}
                onClick={() => inputFileRef.current?.click()}
                style={{ cursor: "pointer", marginTop: "10px" }}
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
          </div>

          {errorMessage && (
            <div className="text-danger text-center mb-3">{errorMessage}</div>
          )}

          <button className="btn btn-primary w-100" type="submit">
            Save
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default PostFormModal;
