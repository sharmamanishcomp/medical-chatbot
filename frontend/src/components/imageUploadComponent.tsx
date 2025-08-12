import { useState } from "react";

function ImageUploadComponent({ image, setImage }: { image: File | null, setImage: (f: File | null) => void }) {
    // const [image, setImage] = useState<string | null>(null);

    return (
        <>
          <div className="image-panel-header">
            <span role="img" aria-label="image" className="image-icon">🖼️</span>
            <span className="flex-spacer" />
            <label className="image-upload-label">
              Upload
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              className="uploaded-image"
            />
          ) : (
            <div className="no-image">
              No image uploaded
            </div>
          )}
        </>
    )
}

export default ImageUploadComponent;