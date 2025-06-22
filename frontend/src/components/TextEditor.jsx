import { useRef, useCallback } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import { fileUploadUsingJson } from '../util/cdn';

// Register the image resize module
Quill.register("modules/imageResize", ImageResize);
const uploadMsg = "Uploading image...";

const TextEditor = ({ value, onChange }) => {
  // Create a reference to the Quill editor
  const quillRef = useRef();
  const imageRef = useRef();

  // Function to handle image upload to CDN
  const quillImageHandler = useCallback(() => {
    imageRef.current.click();
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
        [{ color: [] }, { background: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ direction: "rtl" }, { align: [] }],
        ["link", "image", "video", "formula"],
        ["clean"],
      ],
      handlers: {
        image: quillImageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };

  const fileUploadHandler = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Show loading state
        const range = quillRef.current.getEditor().getSelection();
        quillRef.current
          .getEditor()
          .insertText(range.index, uploadMsg, {
            color: "#999",
            italic: true,
          });

        // Upload to CDN endpoint

        await fileUploadUsingJson(event, (imageUrl) => {
          // Remove the loading text
          quillRef.current
            .getEditor()
            .deleteText(range.index, uploadMsg.length);

          // Insert the uploaded image
          quillRef.current
            .getEditor()
            .insertEmbed(range.index, "image", imageUrl);
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
      />
      <input ref={imageRef} type="file" accept="image/*" style={{ display: "none" }} onChange={fileUploadHandler} />
    </>
  );
};

export default TextEditor;
