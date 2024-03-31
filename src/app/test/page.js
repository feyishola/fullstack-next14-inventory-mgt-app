// Understanding Server Actions

//initially, we were using usetate to send data to db example below

// "use client";
// import React, { useState } from "react";

// const Page = () => {
//   const [input, setInput] = useState({});
//   const [data, setData] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // handle form submission logic here
//     console.log("Form Submitted with input", input);
//     try {
//       const res = fetch("/uri", input);
//       if (res) {
//         setData(res);
//         // navigate to page of choice using useNavigate hook
//       }
//     } catch (error) {
//       setError(error);
//     }
//     //Clearing the input field after submission
//     setInput("");
//   };

//   return (
//     <div className="mt-5">
//       <form onSubmit={handleSubmit} className="flex flex-col mt-5">
//         <input
//           type="text"
//           name="firstname"
//           // value={input}
//           className="text-black mt-2"
//           placeholder="firstname"
//           onChange={(e) =>
//             setInput({ ...input, [e.target.name]: e.target.value })
//           }
//         />
//         <input
//           type="text"
//           name="password"
//           // value={input}
//           className="text-black mt-2"
//           placeholder="password"
//           onChange={(e) =>
//             setInput({ ...input, [e.target.name]: e.target.value })
//           }
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default Page;

// *********************************************************************

//Now, we would be using Server Actions

import React from "react";

const Page = () => {
  const handleForm = async (formData) => {
    "use server";
    const firstname = formData.get("firstname");
    // console.log(formData);
    console.log("hello", firstname);
  };

  return (
    <div>
      <form action={handleForm}>
        <input type="text" name="firstname" />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Page;
