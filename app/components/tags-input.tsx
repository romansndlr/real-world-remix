import * as React from "react";

const TagsInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  name,
}) => {
  const [tags, setTags] = React.useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = e.currentTarget.value;

      setTags((prevTags) => [...prevTags, value]);

      e.currentTarget.value = "";
    }
  };

  return (
    <div>
      <input
        type="text"
        className="form-control"
        placeholder="Enter tags"
        onKeyDown={handleKeyDown}
      />
      <input type="hidden" name={name} value={tags} />
      <div className="tag-list">
        {tags.map((tag, i) => (
          <span key={`${tag}-${i}`}>
            <span className="tag-default tag-pill">
              <i
                className="ion-close-round"
                onClick={() => {
                  setTags((prevTags) => prevTags.filter((t) => t !== tag));
                }}
              ></i>
              {tag}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
