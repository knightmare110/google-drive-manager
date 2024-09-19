import React, { useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../utils/constant";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${BASE_API_URL}drive/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Include cookies
    });
    setFile(null); // Clear the file input after upload
  };

  return (
    <div>
			<div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
				<div className="text-center">
					<h2 className="mt-5 text-3xl font-bold text-gray-900">File Upload!</h2>
					<p className="mt-2 text-sm text-gray-400">Lorem ipsum is placeholder text.</p>
				</div>
				<div>
					<div className="grid grid-cols-1 space-y-2">
						<label className="text-sm font-bold text-gray-500 tracking-wide">Title</label>
						<input
							className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
							type="text"
							placeholder="mail@gmail.com"
						/>
					</div>
					<div className="grid grid-cols-1 space-y-2">
						<label className="text-sm font-bold text-gray-500 tracking-wide">Attach Document</label>
						<div className="flex items-center justify-center w-full">
							<label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
								<div className="h-full w-full text-center flex flex-col items-center justify-center">
									<div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
										<img
											className="has-mask h-36 object-center"
											src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
											alt="freepik upload"
										/>
									</div>
									<p className="pointer-none text-gray-500">
										<span className="text-sm">Drag and drop</span> files here <br /> or{" "}
										<a href="#" className="text-blue-600 hover:underline">
											select a file
										</a>{" "}
										from your computer
									</p>
								</div>
								<input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
							</label>
						</div>
					</div>
					<p className="text-sm text-gray-300">
						<span>File type: doc, pdf, types of images</span>
					</p>
					<div>
						<button
							onClick={uploadFile}
							className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
						>
							Upload
						</button>
					</div>
				</div>
			</div>
    </div>
  );
};

export default FileUpload;
