// src/components/reusable/ReadMoreComponent.jsx
import React, { useState, useRef } from "react";

const ReadMoreComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="mt-12 opacity-100 overflow-hidden ">
      <div
        ref={contentRef}
        className={`transition-all duration-500 ease-in-out`}
        style={{
          maxHeight: isExpanded ? contentRef.current.scrollHeight : "144px",
        }}
      >
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat
        suscipit consequatur quod iure dolorem in facere iusto autem repellat?
        <br />
        Illo modi nulla incidunt eligendi nisi saepe, ex laborum officia libero.
        Lorem ipsum dolor sharum cumque! Tempora doloremque id aut animi
        laudantium, vero eius repudiandae illo inventore, ullam voluptatum, quo
        ut dolore enim ducimus maxime! Consequuntur itaque a officia dolorem
        suscipit iste magnam laudantium aspernatur adipisci impedit omnis,
        architecto, odio eligendi obcaecati? Quisquam, placeat! Ut
        exercitationem iure, esse iusto incidunt distinctio a non libero veniam
        eius, quos pariatur error in fuga perferendis harum. Quidem provident,
        hic at dolorem denim, veniam repellat. Optio sunt inventore consectetur
        maiores.
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum aperiam
        repellendus non excepturi libero, ipsam maxime soluta, distincs,
        pariatur doloribus, rem ut? Rerum natus mollitia quo labore voluptatibus
        voluptas maiores similique! Ut, quasi.
      </div>
      <button
        className="text-blue-500 absolute cursor-pointer"
        onClick={toggleReadMore}
      >
        {isExpanded ? "Read Less" : "Read More..."}
      </button>
    </div>
  );
};

export default ReadMoreComponent;
