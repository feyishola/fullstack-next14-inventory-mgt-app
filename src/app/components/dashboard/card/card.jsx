import { MdSupervisedUserCircle } from "react-icons/md";

//Dummy Data

// const item = {
//   title:"Stats Card",
//   number:1000,
//   details:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   change:50,

// }


const Card = ({ item }) => {
  return (
    <div className="bg-[#182237] hover:bg-[#2e374a] p-5 rounded-xl flex gap-5 cursor-pointer w-full">
      <MdSupervisedUserCircle size={24} />
      <div className='flex flex-col gap-5'>
        <span className="title">{item?.title}</span>
        <span className="text-2xl font-medium">{item?.number}</span>
        <span className="text-sm font-light">
          {item?.details}
          <span className={item?.change > 0 ? "text-[lime]" : "text-[red]"}>
            {item?.change}%
          </span>{" "}
          {item?.change > 0 ? "more" : "less"} than previous week
        </span>
      </div>
    </div>
  );
};

export default Card;