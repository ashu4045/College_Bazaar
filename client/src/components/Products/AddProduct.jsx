import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Utilities/Loading";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    categories: "Study Materials",
  });
  const imageRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (details.name === "") {
      return window.alert("please enter a name");
    }
    if (details.description === "")
      return window.alert("write something about your product in description");
    if (details.price === "")
      return window.alert(
        "Are you offering your item for free :) ?? \nIf not, write its price"
      );
    setLoading(true);
    fetch(
      `${
        process.env.REACT_APP_SERVER_URL
      }/api/product/add/${sessionStorage.getItem("user")}`,
      {
        method: "POST",
        Credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        window.alert(res.message);
        navigate("/dashboard");
        setLoading(false);
      })
      .catch((err) => {
        window.alert("cannot process request at this moment");
        setLoading(false);
      });
  };
  function handleChange(e, field) {
    //function to handle all the inputs, except image
    setDetails({ ...details, [field]: e.target.value });
  }
  function handleImage() {
    //function to handle the image input
    const image = imageRef.current.files[0];
    if (image && image["type"].split("/")[0] === "image") {
      //continue only if file is an image.
      let fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) => {
        let srcData = fileLoadedEvent.target.result; // <--- data: base64
        setDetails({ ...details, image: srcData });
      };
      fileReader.readAsDataURL(image);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="mt-4">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 mt-4 text-center sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add a Product
              </h3>
            </div>
          </div>
          <form>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 space-y-6 bg-white sm:p-6">
                  <div>
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700"
                    >
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        onChange={(e) => handleChange(e, "description")}
                        name="about"
                        rows={3}
                        className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="write about product here.."
                        defaultValue={""}
                      />
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="Name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      onChange={(e) => handleChange(e, "name")}
                      name="name"
                      id="Name"
                      autoComplete="Name"
                      className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="Price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      onChange={(e) => handleChange(e, "price")}
                      name="Price"
                      id="Price"
                      autoComplete="Price"
                      className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  {details.image === "" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Photo of product
                      </label>
                      <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                ref={imageRef}
                                onChange={(e) => handleImage()}
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {
                    //for rendering image-->
                    details.image !== "" && (
                      <img
                        src={details.image}
                        alt=""
                        className="w-20 h-20 ml-2 rounded-3xl"
                      />
                    )
                  }
                </div>
              </div>

              <div className="relative inline-block w-64">
                <select
                  onChange={(e) => handleChange(e, "categories")}
                  className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
                >
                  <option disabled>Pick a category</option>
                  <option defaultChecked>Study Materials</option>
                  <option>Furnitures</option>
                  <option>Electricals</option>
                  <option>Others</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-stretch mt-3">
              <div className="self-center flex-1 text-center">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-2 py-1 font-bold text-white bg-indigo-600 rounded-full shadow-xl hover:bg-indigo-500"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
    </>
  );
}
