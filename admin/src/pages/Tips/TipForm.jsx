import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const TipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const { data } = await api.get(`/tips/${id}`);
          setFormData({
            title: data.title,
            deadline: data.deadline ? data.deadline.split("T")[0] : "",
          });
          setCoverPreview(data.coverImage.url);

          window.tipContentToLoad = data.content;
          setDataLoaded(true);
        } catch (error) {
          toast.error("Failed to load blog");
        }
      };
      fetchData();
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const initQuill = () => {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });

      const toolbar = quillRef.current.getModule("toolbar");
      toolbar.addHandler("image", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);
          const toastId = toast.loading("Uploading...");

          try {
            const { data } = await api.post("/tips/upload-media", formData);
            const range = quillRef.current.getSelection(true);
            quillRef.current.insertEmbed(range.index, "image", data.url);
            toast.success("Uploaded!", { id: toastId });
          } catch (error) {
            toast.error("Upload failed", { id: toastId });
          }
        };
        input.click();
      });

      console.log("✅ Quill initialized");
    };

    const timer = setTimeout(initQuill, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (dataLoaded && quillRef.current && window.tipContentToLoad) {
      console.log("📝 Loading content into editor...");
      quillRef.current.root.innerHTML = window.tipContentToLoad;
      delete window.tipContentToLoad;
      console.log("Content loaded successfully");
    }
  }, [dataLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = quillRef.current?.root.innerHTML || "";
    if (!formData.title || !content) {
      toast.error("Title and content required");
      return;
    }
    if (!isEditMode && !coverImage) {
      toast.error("Cover image required");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", content);
    if (formData.deadline) data.append("deadline", formData.deadline);
    if (coverImage) data.append("coverImage", coverImage);

    try {
      if (isEditMode) {
        await api.put(`/tips/${id}`, data);
        toast.success("Updated!");
      } else {
        await api.post("/tips", data);
        toast.success("Created!");
      }
      navigate("/tips");
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/tips")}
          className="bg-gray-200 text-black p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-black">
          {isEditMode ? "Edit Blog" : "Create Blog"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-6">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter title..."
            required
          />

          <Input
            label="Deadline (Optional)"
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            min={new Date().toISOString().split("T")[0]}
          />

          <div>
            <label className="block text-sm font-bold mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-black p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setCoverImage(file);
                    setCoverPreview(URL.createObjectURL(file));
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {coverPreview ? (
                <div className="relative h-64 w-full pointer-events-none">
                  <img
                    src={coverPreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity text-white font-bold pointer-events-none">
                    Click to Change
                  </div>
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center gap-2 text-gray-500 pointer-events-none">
                  <ImageIcon size={48} />
                  <p>Upload cover image</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Content</label>
            <div className="h-[500px] pb-16 border-2 border-black">
              <div ref={editorRef} className="h-full" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => navigate("/tips")}
            className="bg-gray-200 text-black"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-green-500"
          >
            <Save size={20} />
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TipForm;
