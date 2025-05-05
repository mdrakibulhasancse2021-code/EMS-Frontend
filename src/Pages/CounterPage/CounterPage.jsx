import { useDispatch, useSelector } from "react-redux";
import CenterizeComponent from "../../Components/CustomReuseableComponent/CenterizeComponent";
import {
  decrement,
  increment,
} from "../../redux/features/CounterSlice/CounterSlice";

const CounterPage = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);

  return (
    <CenterizeComponent>
      <div
        className="flex w-1/2  p-12 rounded-2xl justify-evenly items-center border-2 border-purple-500
     "
      >
        <button
          onClick={() => dispatch(increment())}
          className="px-3 py-2 rounded-md bg-green-800 text-white font-semibold"
        >
          Increment
        </button>
        <p className="text-4xl font-bold">{count}</p>
        <button
          onClick={() => dispatch(decrement())}
          className="px-3 py-2 rounded-md bg-red-800 text-white font-semibold"
        >
          Decrement
        </button>
      </div>
    </CenterizeComponent>
  );
};

export default CounterPage;
