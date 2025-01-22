import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTasks } from "../../ReduxToolkit/Reducers/taskSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const TopCriticalTasksCarousel = () => {
  const tasks = useSelector(selectTasks);
  const [criticalTasks, setCriticalTasks] = useState<any[]>([]);
  

  useEffect(() => {
    const now = new Date();
    const withinADay = new Date(now.getTime() + 240 * 60 * 60 * 1000);

    const sortedTasks = tasks
      .filter((task) => {
        const dueDate = new Date(task.due_date);
        //return dueDate > now && dueDate <= withinADay && !task.isExpired;
        return dueDate > now && dueDate <= withinADay;
      })
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);

    setCriticalTasks(sortedTasks);
  }, [tasks]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Top Critical Tasks</h2>
      {criticalTasks.length === 0 ? (
        <p className="text-center text-gray-500">No critical tasks to display</p>
      ) : (
        <Slider {...settings}>
          {criticalTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white shadow-md rounded p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
              <p className="mb-1">
                <strong>Due Date:</strong> {new Date(task.due_date).toLocaleString()}
              </p>
              <p className="mb-1">
                <strong>Importance:</strong> {task.importance}
              </p>
              <p className="text-gray-700">{task.description}</p>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default TopCriticalTasksCarousel;
